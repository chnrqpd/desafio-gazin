'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'niveis',
      [
        {
          nivel: 'Junior',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nivel: 'Pleno',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nivel: 'Senior',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('niveis', null, {});
  },
};
