'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuariosproductos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING
      }
      ,
      productos_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "productos",
          key: "id"
        }
      },
      usuarios_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "id"
        }
      },
      total: {
        type: Sequelize.DOUBLE
      },
      cantidad: {
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
    await queryInterface.dropTable('UsuariosProductos');
  }
};