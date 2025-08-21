const express = require('express');
const niveisController = require('../controllers/niveisController');

const router = express.Router();

router.get('/', niveisController.index);

module.exports = router;