'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    let categorias = [
      { nombre: "categoria1" },
      { nombre: "categoria2" },
      { nombre: "categoria3" },
      { nombre: "categoria4" },
      { nombre: "categoria5" },
      { nombre: "categoria6" }
    ]

    await queryInterface.bulkInsert('categorias', categorias, {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
