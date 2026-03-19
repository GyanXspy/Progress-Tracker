const express = require('express');
const router = express.Router();
const jobApplicationsController = require('../controllers/jobApplicationsController');

router.get('/', jobApplicationsController.getAllApplications);
router.post('/', jobApplicationsController.createApplication);
router.put('/:id', jobApplicationsController.updateApplication);
router.delete('/:id', jobApplicationsController.deleteApplication);

// Notes and Salary details
router.get('/:id/notes', jobApplicationsController.getApplicationNotes);
router.post('/:id/notes', jobApplicationsController.addApplicationNote);

module.exports = router;
