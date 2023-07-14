'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'senha-padrao', // Adicione um valor padrão aqui
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'senha-padrao', // Adicione um valor padrão aqui
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'senha-padrao', // Adicione um valor padrão aqui
      },
      salario: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'senha-padrao', // Adicione um valor padrão aqui
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'senha-padrao', // Adicione um valor padrão aqui
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addresses');
  },
};