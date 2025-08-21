const express = require('express');
const desenvolvedoresController = require('../controllers/desenvolvedoresController');
const { validateDesenvolvedor, validateId } = require('../middlewares/validationMiddleware');
const paginationMiddleware = require('../middlewares/paginationMiddleware');

const router = express.Router();

router.get('/', paginationMiddleware, desenvolvedoresController.index);
router.post('/', validateDesenvolvedor, desenvolvedoresController.store);
router.get('/:id', validateId, desenvolvedoresController.show);
router.put('/:id', validateId, validateDesenvolvedor, desenvolvedoresController.update);
router.delete('/:id', validateId, desenvolvedoresController.destroy);

module.exports = router;