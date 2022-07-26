'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuarios.belongsToMany(models.Productos, { through: "usuariosproductos", foreignKey: "usuarios_id" })
    }
  }
  Usuarios.init({
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    rol: DataTypes.INTEGER,
    token: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuarios',
  });
  return Usuarios;
};