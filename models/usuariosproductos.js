'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuariosProductos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsuariosProductos.init({
    codigo: DataTypes.STRING,
    productos_id: DataTypes.INTEGER,
    usuarios_id: DataTypes.INTEGER,
    total: DataTypes.DOUBLE,
    cantidad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuariosProductos',
  });
  return UsuariosProductos;
};