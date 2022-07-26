'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Productos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Productos.belongsToMany(models.Categorias, { through: 'productoscategorias', foreignKey: 'productos_id' })
      Productos.belongsToMany(models.Imagenes, { through: 'productosimagenes', foreignKey: 'productos_id' })
      Productos.belongsToMany(models.Colores, { through: 'productoscolores', foreignKey: 'productos_id' })
      Productos.belongsToMany(models.Usuarios, { through: 'usuariosproductos', foreignKey: 'productos_id' })
    }
  }
  Productos.init({
    nombre: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    p_compra: DataTypes.DOUBLE,
    p_venta: DataTypes.DOUBLE,
    modelo: DataTypes.STRING,
    alto: DataTypes.INTEGER,
    ancho: DataTypes.INTEGER,
    profundidad: DataTypes.INTEGER,
    descripcion: DataTypes.STRING,
    codigo: DataTypes.STRING,
    estado: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Productos',
  });
  return Productos;
};