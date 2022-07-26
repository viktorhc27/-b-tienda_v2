'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productoscategorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productos_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "productos",
          key: "id"
        }
      },
      categorias_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "categorias",
          key: "id"
        }
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductosCategorias');
  }
};