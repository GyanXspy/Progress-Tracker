const db = require('../config/db');

exports.getAllConcepts = async (req, res) => {
    try {
        const user_id = req.query.user_id || 1;
        const [rows] = await db.query('SELECT * FROM concepts WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createConcept = async (req, res) => {
    try {
        const { user_id, title, priority, resources, target_date } = req.body;
        const uId = user_id || 1;

        const [result] = await db.query(
            'INSERT INTO concepts (user_id, title, priority, status, resources, target_date) VALUES (?, ?, ?, ?, ?, ?)',
            [uId, title, priority || 'Medium', 'Not Started', resources || '', target_date || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Concept created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateConcept = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, priority, status, resources, target_date } = req.body;
        
        const [existing] = await db.query('SELECT * FROM concepts WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Concept not found' });
        const old = existing[0];

        const [result] = await db.query(
            'UPDATE concepts SET title=?, priority=?, status=?, resources=?, target_date=? WHERE id=?',
            [
                title !== undefined ? title : old.title,
                priority !== undefined ? priority : old.priority,
                status !== undefined ? status : old.status,
                resources !== undefined ? resources : old.resources,
                target_date !== undefined ? target_date : old.target_date,
                id
            ]
        );
        
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Concept not found' });
        res.json({ message: 'Concept updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteConcept = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM concepts WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Concept not found' });
        res.json({ message: 'Concept deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
