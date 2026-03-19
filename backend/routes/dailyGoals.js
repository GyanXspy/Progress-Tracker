const express = require('express');
const router = express.Router();
const dailyGoalsController = require('../controllers/dailyGoalsController');

router.get('/', dailyGoalsController.getGoalsByDate);
router.post('/', dailyGoalsController.createOrUpdateGoal);
router.get('/history', dailyGoalsController.getGoalHistory);

module.exports = router;
