const express = require('express');
const niveisController = require('../controllers/niveisController');
const { validateNivel, validateId } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', niveisController.index);
router.post('/', validateNivel, niveisController.store);
router.get('/:id', validateId, niveisController.show);
router.put('/:id', validateId, validateNivel, niveisController.update);
router.delete('/:id', validateId, niveisController.destroy);

module.exports = router;