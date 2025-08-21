// backend/src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Desafio Gazin - API de Desenvolvedores',
      version: '1.0.0',
      description:
        'API RESTful para gerenciamento de desenvolvedores e níveis de senioridade',
      contact: {
        name: 'Caio Henrique Primo Dario',
        email: 'chnrqpd@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Desenvolvedor: {
          type: 'object',
          required: ['nome', 'sexo', 'data_nascimento', 'hobby', 'nivel_id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do desenvolvedor',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome completo do desenvolvedor',
              example: 'João Silva',
            },
            sexo: {
              type: 'string',
              enum: ['M', 'F'],
              description: 'Sexo do desenvolvedor',
              example: 'M',
            },
            data_nascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento',
              example: '1990-05-15',
            },
            hobby: {
              type: 'string',
              description: 'Hobby do desenvolvedor',
              example: 'Jogar videogame',
            },
            nivel_id: {
              type: 'integer',
              description: 'ID do nível de senioridade',
              example: 1,
            },
            nivel: {
              $ref: '#/components/schemas/Nivel',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
            },
          },
        },
        Nivel: {
          type: 'object',
          required: ['nivel'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do nível',
              example: 1,
            },
            nivel: {
              type: 'string',
              description: 'Nome do nível de senioridade',
              example: 'Junior',
            },
            total_desenvolvedores: {
              type: 'integer',
              description: 'Quantidade de desenvolvedores neste nível',
              example: 5,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                oneOf: [
                  { $ref: '#/components/schemas/Desenvolvedor' },
                  { $ref: '#/components/schemas/Nivel' },
                ],
              },
            },
            meta: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total de registros',
                  example: 100,
                },
                per_page: {
                  type: 'integer',
                  description: 'Registros por página',
                  example: 10,
                },
                current_page: {
                  type: 'integer',
                  description: 'Página atual',
                  example: 1,
                },
                last_page: {
                  type: 'integer',
                  description: 'Última página',
                  example: 10,
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Erro ao processar solicitação',
            },
            status: {
              type: 'integer',
              description: 'Código de status HTTP',
              example: 400,
            },
          },
        },
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Número da página',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Quantidade de itens por página',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Termo de busca',
          required: false,
          schema: {
            type: 'string',
          },
        },
        SortParam: {
          name: 'sort',
          in: 'query',
          description: 'Campo para ordenação',
          required: false,
          schema: {
            type: 'string',
          },
        },
        OrderParam: {
          name: 'order',
          in: 'query',
          description: 'Direção da ordenação',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc',
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
