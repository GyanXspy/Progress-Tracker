const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
    try {
        // Connect without database first to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL server.');

        // Read and execute init.sql
        const sqlFilePath = path.join(__dirname, 'db', 'init.sql');
        const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8');

        // Split by semicolon, but handle carefully
        const statements = sqlCommands.split(';').filter(stmt => stmt.trim() !== '');

        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('Database and tables initialized successfully!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
