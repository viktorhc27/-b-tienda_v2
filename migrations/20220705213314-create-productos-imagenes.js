'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productosimagenes', {
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
      imagenes_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "imagenes",
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
    await queryInterface.dropTable('ProductosImagenes');
  }
};