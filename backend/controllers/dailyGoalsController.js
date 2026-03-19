const db = require('../config/db');

exports.getGoalsByDate = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        // Using user_id = 1 for demo purposes
        const user_id = req.query.user_id || 1;

        const [rows] = await db.query('SELECT * FROM daily_goals WHERE user_id = ? AND date = ?', [user_id, date]);
        
        if (rows.length === 0) {
            return res.json(null); // No goals found for this date
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrUpdateGoal = async (req, res) => {
    try {
        const { user_id, date, problems_target, concepts_target, applications_target, problems_completed, concepts_completed, applications_completed, status } = req.body;
        const uId = user_id || 1;

        // Check if goal exists for date
        const [existing] = await db.query('SELECT * FROM daily_goals WHERE user_id = ? AND date = ?', [uId, date]);

        if (existing.length > 0) {
            // Update
            const goalId = existing[0].id;
            const query = `
                UPDATE daily_goals 
                SET problems_target=?, concepts_target=?, applications_target=?,
                    problems_completed=?, concepts_completed=?, applications_completed=?, status=?
                WHERE id=?
            `;
            await db.query(query, [
                problems_target ?? existing[0].problems_target,
                concepts_target ?? existing[0].concepts_target,
                applications_target ?? existing[0].applications_target,
                problems_completed ?? existing[0].problems_completed,
                concepts_completed ?? existing[0].concepts_completed,
                applications_completed ?? existing[0].applications_completed,
                status ?? existing[0].status,
                goalId
            ]);
            res.json({ message: 'Goal updated successfully', id: goalId });
        } else {
            // Create
            const [result] = await db.query(`
                INSERT INTO daily_goals 
                (user_id, date, problems_target, concepts_target, applications_target, problems_completed, concepts_completed, applications_completed, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                uId, date, 
                problems_target || 0, concepts_target || 0, applications_target || 0,
                problems_completed || 0, concepts_completed || 0, applications_completed || 0,
                status || 'Incomplete'
            ]);
            res.status(201).json({ id: result.insertId, message: 'Goal created successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGoalHistory = async (req, res) => {
    try {
        const user_id = req.query.user_id || 1;
        const [rows] = await db.query('SELECT * FROM daily_goals WHERE user_id = ? ORDER BY date DESC LIMIT 30', [user_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
