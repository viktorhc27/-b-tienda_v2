'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.INTEGER
      },
      p_compra: {
        type: Sequelize.DOUBLE
      },
      p_venta: {
        type: Sequelize.DOUBLE
      },
      modelo: {
        type: Sequelize.STRING
      },
      alto: {
        type: Sequelize.INTEGER
      },
      ancho: {
        type: Sequelize.INTEGER
      },
      profundidad: {
        type: Sequelize.INTEGER
      },
      descripcion: {
        type: Sequelize.STRING
      },
      codigo: {
        type: Sequelize.STRING
      },
      estado: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Productos');
  }
};