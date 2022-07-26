'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Colores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Colores.belongsToMany(models.Productos, { through: 'productoscolores', foreignKey: 'colores_id'})
    }
  }
  Colores.init({
    nombre: DataTypes.STRING,
    codigo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Colores',
  });
  return Colores;
};