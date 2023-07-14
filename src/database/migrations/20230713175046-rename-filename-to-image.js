'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('addresses', 'filename', 'image');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('addresses', 'image', 'filename');
  }
};