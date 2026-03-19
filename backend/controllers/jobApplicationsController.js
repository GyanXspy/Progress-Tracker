const db = require('../config/db');

exports.getAllApplications = async (req, res) => {
    try {
        const user_id = req.query.user_id || 1;
        const [rows] = await db.query(`
            SELECT ja.*, sd.base_salary, sd.bonus, sd.stock_options, sd.total_compensation 
            FROM job_applications ja
            LEFT JOIN salary_details sd ON ja.id = sd.application_id
            WHERE ja.user_id = ? 
            ORDER BY ja.application_date DESC
        `, [user_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createApplication = async (req, res) => {
    try {
        const { user_id, company_name, position, description, application_date, job_link, status } = req.body;
        const uId = user_id || 1;

        const [result] = await db.query(
            'INSERT INTO job_applications (user_id, company_name, position, description, application_date, job_link, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uId, company_name, position, description || '', application_date, job_link || '', status || 'Applied']
        );
        res.status(201).json({ id: result.insertId, message: 'Job application created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, position, description, application_date, job_link, status, salary_details } = req.body;
        
        const [existing] = await db.query('SELECT * FROM job_applications WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Job application not found' });
        const old = existing[0];

        await db.query(
            'UPDATE job_applications SET company_name=?, position=?, description=?, application_date=?, job_link=?, status=? WHERE id=?',
            [
                company_name !== undefined ? company_name : old.company_name,
                position !== undefined ? position : old.position,
                description !== undefined ? description : old.description,
                application_date !== undefined ? application_date : old.application_date,
                job_link !== undefined ? job_link : old.job_link,
                status !== undefined ? status : old.status,
                id
            ]
        );

        // Update or insert salary details if provided and status is Offer Received
        if (salary_details && status === 'Offer Received') {
            const { base_salary, bonus, stock_options, total_compensation } = salary_details;
            
            // Check if salary details exist
            const [existing] = await db.query('SELECT * FROM salary_details WHERE application_id = ?', [id]);
            if (existing.length > 0) {
                await db.query(
                    'UPDATE salary_details SET base_salary=?, bonus=?, stock_options=?, total_compensation=? WHERE application_id=?',
                    [base_salary || 0, bonus || 0, stock_options || 0, total_compensation || 0, id]
                );
            } else {
                await db.query(
                    'INSERT INTO salary_details (application_id, base_salary, bonus, stock_options, total_compensation) VALUES (?, ?, ?, ?, ?)',
                    [id, base_salary || 0, bonus || 0, stock_options || 0, total_compensation || 0]
                );
            }
        }
        
        res.json({ message: 'Job application updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM job_applications WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Job application not found' });
        res.json({ message: 'Job application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getApplicationNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM application_notes WHERE application_id = ? ORDER BY created_at DESC', [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addApplicationNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const [result] = await db.query('INSERT INTO application_notes (application_id, note) VALUES (?, ?)', [id, note]);
        res.status(201).json({ id: result.insertId, message: 'Note added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
