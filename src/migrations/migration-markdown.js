'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Markdown', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contentHTML: {
        type: Sequelize.TEXT('long')
      },
      contentMarkdown: {
        type: Sequelize.TEXT('long')
      },
      description: {
        type: Sequelize.TEXT('long')
      },  
      ClinicId: {
        type: Sequelize.STRING
      },
      specialtyId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Markdown');
  }
};