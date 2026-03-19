const express = require('express');
const router = express.Router();
const conceptsController = require('../controllers/conceptsController');

router.get('/', conceptsController.getAllConcepts);
router.post('/', conceptsController.createConcept);
router.put('/:id', conceptsController.updateConcept);
router.delete('/:id', conceptsController.deleteConcept);

module.exports = router;
