const express = require('express');
const desenvolvedoresController = require('../controllers/desenvolvedoresController');
const {
  validateDesenvolvedor,
  validateId,
} = require('../middlewares/validationMiddleware');
const paginationMiddleware = require('../middlewares/paginationMiddleware');

const router = express.Router();

/**
 * @swagger
 * /desenvolvedores:
 *   get:
 *     tags:
 *       - Desenvolvedores
 *     summary: Lista todos os desenvolvedores
 *     description: Retorna uma lista paginada de desenvolvedores com opções de busca e ordenação
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *     responses:
 *       200:
 *         description: Lista de desenvolvedores retornada com sucesso
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
 *                         $ref: '#/components/schemas/Desenvolvedor'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', paginationMiddleware, desenvolvedoresController.index);

/**
 * @swagger
 * /desenvolvedores:
 *   post:
 *     tags:
 *       - Desenvolvedores
 *     summary: Cria um novo desenvolvedor
 *     description: Adiciona um novo desenvolvedor ao sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - sexo
 *               - data_nascimento
 *               - hobby
 *               - nivel_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria Santos"
 *               sexo:
 *                 type: string
 *                 enum: [M, F]
 *                 example: "F"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "1985-08-20"
 *               hobby:
 *                 type: string
 *                 example: "Leitura"
 *               nivel_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Desenvolvedor criado com sucesso
 *       400:
 *         description: Dados inválidos fornecidos
 */
router.post('/', validateDesenvolvedor, desenvolvedoresController.store);

/**
 * @swagger
 * /desenvolvedores/{id}:
 *   get:
 *     tags:
 *       - Desenvolvedores
 *     summary: Busca um desenvolvedor por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Desenvolvedor encontrado
 *       404:
 *         description: Desenvolvedor não encontrado
 */
router.get('/:id', validateId, desenvolvedoresController.show);

/**
 * @swagger
 * /desenvolvedores/{id}:
 *   put:
 *     tags:
 *       - Desenvolvedores
 *     summary: Atualiza um desenvolvedor
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
 *               nome:
 *                 type: string
 *               sexo:
 *                 type: string
 *                 enum: [M, F]
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               hobby:
 *                 type: string
 *               nivel_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Desenvolvedor atualizado com sucesso
 *       404:
 *         description: Desenvolvedor não encontrado
 */
router.put(
  '/:id',
  validateId,
  validateDesenvolvedor,
  desenvolvedoresController.update
);

/**
 * @swagger
 * /desenvolvedores/{id}:
 *   delete:
 *     tags:
 *       - Desenvolvedores
 *     summary: Remove um desenvolvedor
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Desenvolvedor removido com sucesso
 *       404:
 *         description: Desenvolvedor não encontrado
 */
router.delete('/:id', validateId, desenvolvedoresController.destroy);

module.exports = router;
