const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running...' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/daily-goals', require('./routes/dailyGoals'));
app.use('/api/concepts', require('./routes/concepts'));
app.use('/api/job-applications', require('./routes/jobApplications'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
