CREATE DATABASE IF NOT EXISTS placement_tracker;
USE placement_tracker;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo user (id=1) since controllers default to user_id = 1
INSERT IGNORE INTO users (id, username, name, email, password_hash) 
VALUES (1, 'demo_user', 'Demo User', 'demo@example.com', 'hashed_password');

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    status ENUM('Solved', 'Unsolved') DEFAULT 'Unsolved',
    source VARCHAR(100),
    time_spent_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    problems_target INT DEFAULT 0,
    problems_completed INT DEFAULT 0,
    concepts_target INT DEFAULT 0,
    concepts_completed INT DEFAULT 0,
    applications_target INT DEFAULT 0,
    applications_completed INT DEFAULT 0,
    status ENUM('Incomplete', 'Completed') DEFAULT 'Incomplete',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY user_date_unique (user_id, date)
);

CREATE TABLE IF NOT EXISTS concepts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Not Started', 'In Progress', 'Learned') DEFAULT 'Not Started',
    resources TEXT,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    description TEXT,
    application_date DATE NOT NULL,
    job_link VARCHAR(500),
    status ENUM('Applied', 'Under Review', 'Interview Scheduled', 'Technical Round', 'HR Round', 'Offer Received', 'Rejected', 'Withdrawn') DEFAULT 'Applied',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS application_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS salary_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    base_salary DECIMAL(10, 2),
    bonus DECIMAL(10, 2),
    stock_options DECIMAL(10, 2),
    total_compensation DECIMAL(10, 2),
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);
