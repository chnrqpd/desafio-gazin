const express = require('express');
const niveisController = require('../controllers/niveisController');
const {
  validateNivel,
  validateId,
} = require('../middlewares/validationMiddleware');
const paginationMiddleware = require('../middlewares/paginationMiddleware');

const router = express.Router();

/**
 * @swagger
 * /niveis:
 *   get:
 *     tags:
 *       - Níveis
 *     summary: Lista todos os níveis
 *     description: Retorna uma lista paginada de níveis com opções de busca e ordenação
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *     responses:
 *       200:
 *         description: Lista de níveis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Nivel'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', paginationMiddleware, niveisController.index);

/**
 * @swagger
 * /niveis:
 *   post:
 *     tags:
 *       - Níveis
 *     summary: Cria um novo nível
 *     description: Adiciona um novo nível de senioridade ao sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nivel
 *             properties:
 *               nivel:
 *                 type: string
 *                 example: "Senior"
 *     responses:
 *       201:
 *         description: Nível criado com sucesso
 *       400:
 *         description: Dados inválidos fornecidos
 */
router.post('/', validateNivel, niveisController.store);

/**
 * @swagger
 * /niveis/{id}:
 *   get:
 *     tags:
 *       - Níveis
 *     summary: Busca um nível por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nível encontrado
 *       404:
 *         description: Nível não encontrado
 */
router.get('/:id', validateId, niveisController.show);

/**
 * @swagger
 * /niveis/{id}:
 *   put:
 *     tags:
 *       - Níveis
 *     summary: Atualiza um nível
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nivel:
 *                 type: string
 *                 example: "Junior Atualizado"
 *     responses:
 *       200:
 *         description: Nível atualizado com sucesso
 *       404:
 *         description: Nível não encontrado
 */
router.put('/:id', validateId, validateNivel, niveisController.update);

/**
 * @swagger
 * /niveis/{id}:
 *   delete:
 *     tags:
 *       - Níveis
 *     summary: Remove um nível
 *     description: Remove um nível do sistema (apenas se não houver desenvolvedores associados)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nível removido com sucesso
 *       400:
 *         description: Não é possível remover nível com desenvolvedores associados
 *       404:
 *         description: Nível não encontrado
 */
router.delete('/:id', validateId, niveisController.destroy);

module.exports = router;
