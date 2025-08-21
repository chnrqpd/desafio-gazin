'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('desenvolvedores', {
      id: {
        type: Sequelize.INTEGER,  
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nivel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'niveis',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sexo: {
        type: Sequelize.CHAR(1),
        allowNull: false
      },
      data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hobby: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,        
        allowNull: false
      
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('desenvolvedores');
  }
};
