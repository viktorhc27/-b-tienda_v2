'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    let productos = [
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 },
      { nombre: "Mesa de Madera", stock: 40, p_compra: 20000, p_venta: 30000, estado: 1 }

    ]

    await queryInterface.bulkInsert('productos', productos, {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('People', null, {});
    
  }
};
