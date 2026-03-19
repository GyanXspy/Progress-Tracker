const db = require('../config/db');

exports.getAllQuestions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM questions ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { user_id, title, topic, difficulty, source } = req.body;
        // In a real app we'd get user_id from auth token. Using 1 as fallback for demo or strict validation.
        const uId = user_id || 1; 

        const [result] = await db.query(
            'INSERT INTO questions (user_id, title, topic, difficulty, source, status) VALUES (?, ?, ?, ?, ?, ?)',
            [uId, title, topic, difficulty, source, 'Unsolved']
        );
        res.status(201).json({ id: result.insertId, message: 'Question created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQuestionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, time_spent_minutes } = req.body;
        
        let query = 'UPDATE questions SET status = ?';
        let params = [status];
        
        if (time_spent_minutes !== undefined) {
            query += ', time_spent_minutes = ?';
            params.push(time_spent_minutes);
        }
        
        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM questions WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSolvedAnalytics = async (req, res) => {
    try {
        const [difficultyStats] = await db.query(
            "SELECT difficulty, COUNT(*) as count FROM questions WHERE status = 'Solved' GROUP BY difficulty"
        );
        const [topicStats] = await db.query(
            "SELECT topic, COUNT(*) as count FROM questions WHERE status = 'Solved' GROUP BY topic"
        );
        res.json({ difficultyStats, topicStats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
