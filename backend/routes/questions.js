const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

// Routes for Questions Practice Module
router.get('/', questionsController.getAllQuestions);
router.post('/', questionsController.createQuestion);
router.put('/:id', questionsController.updateQuestionStatus);
router.delete('/:id', questionsController.deleteQuestion);

// Additional routes for analytics
router.get('/analytics/solved', questionsController.getSolvedAnalytics);

module.exports = router;
