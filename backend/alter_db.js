const mysql = require('mysql2/promise');
require('dotenv').config();

async function alterDb() {
    require('dotenv').config();
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await db.query('ALTER TABLE users ADD COLUMN name VARCHAR(150) NOT NULL AFTER username');
        console.log('Added name column');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column name already exists');
        } else {
            console.error('Error altering table:', err);
        }
    }
    
    // Update the dummy user just in case
    try {
        await db.query(`UPDATE users SET name = 'Demo User' WHERE id = 1`);
        console.log('Updated demo user');
    } catch (e) {
        console.error(e);
    }

    await db.end();
}
alterDb();
