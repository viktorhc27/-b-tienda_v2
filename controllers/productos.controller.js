const db = require('../models');
const express = require('express');
const ProductosController = express();
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const fs = require('fs');
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize("tienda_v2", "root", "", {
    host: "127.0.0.1",
    dialect: 'mysql',
    dialectOptions: {
        // useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
            if (field.type === 'DATETIME' || field.type === 'TIMESTAMP' || field.type === 'DATE') {
                return field.string();
                // return field.string() + 'Z';
            }
            return next()
        },
    },
    timezone: '-04:00',
    define: {
        freezeTableName: true,
        timestamps: false,
        underscored: false
    },
})
const { Op } = require('sequelize');
const hasAccess = require('../pipes/autorizacion.pipe');
const axios = require('axios')

const HOST = require('../config')

const multiPartMiddleware = multipart({
    uploadDir: __dirname + '/../assets/files'

})
ProductosController.use(bodyParser.json());
ProductosController.use(bodyParser.urlencoded({ extended: true }))

ProductosController.post('/subir', multiPartMiddleware, async (req, res) => {
    let archivos = req.files.uploads;
    let id = req.body.id
    //cambia el nombre al archivo agregado
    //
    fs.rename(archivos.path, __dirname + '/../assets/files/' + id + "-" + archivos.name, () => {
        console.log("\nFile Renamed!\n");

        let img = db.Imagenes.create({ nombre: id + "-" + archivos.name })

    });
    let product = await db.Productos.findByPk(id)
    let imagenes = await db.Imagenes.findOne({ attributes: [[Sequelize.fn('max', sequelize.col('id')), 'id'], "nombre"] })
    product.addImagenes(imagenes, { through: { p: 1 } })
    res.json({ mensaje: "Archivo subido" });
});
ProductosController.get('/index', async (req, res) => {
    try {
        if (req.session.cart == undefined) {
            req.session.cart = []

        }
        let list = await db.Productos.findAll(
            {
                include: [
                    { model: db.Colores },
                    { model: db.Categorias },
                    { model: db.Imagenes }
                ]
            })
        console.log(req.session.cart)
        res.json({ response: "Listado Correctamente", data: list });
    } catch (error) {
        res.status(500).json({ err: error, mensaje: 'Error trycatch' })
        console.log(error);
    }

})
ProductosController.get('/detalles/:producto', async (req, res) => {
    try {

        let id = req.params.producto.split('-')[0];

        let list = await db.Productos.findByPk(
            id,
            {
                include: [{ model: db.Colores },
                { model: db.Categorias },
                { model: db.Imagenes }]
            }
        )

        res.json({ datos: list });
    } catch (error) {
        res.status(500).json({ err: error, mensaje: 'Error trycatch' })
        console.log(error);
    }

})
ProductosController.post('/create', async (req, res) => {
    try {
        let access = await hasAccess(req)
        if (!access.success) {
            res.status(400).json(access)
        }

        let idRol = access.model.rol

        if (idRol != 1) {
            res.json({ success: false, response: "No tiene permisos para esta función" })
        }
        let post = req.body.producto;

        let add = await db.Productos.create(post)

        let producto = await db.Productos.findOne({ attributes: [[Sequelize.fn('max', sequelize.col('id')), 'id']] })
        let categorias = req.body.producto.categorias
        let colores = req.body.producto.colores

        for (let i = 0; i < categorias.length; i++) {
            console.log(categorias[i].id)
            let c = await db.Categorias.findByPk(categorias[i].id)
            producto.addCategorias(c)
        }

        for (let i = 0; i < colores.length; i++) {
            console.log(colores[i].id)
            let c = await db.Colores.findByPk(colores[i].id)
            producto.addColores(c)
        }

        res.json({ response: "Agregado Exitosamente" });

    } catch (error) {
        res.status(500).json({ err: error, mensaje: 'Error trycatch' })
        console.log(error);
    }

})
ProductosController.post('/activate', async (req, res) => {
    try {
        let access = await hasAccess(req)
        if (!access.success) {
            res.status(400).json(access)
        }

        let idRol = access.model.rol

        if (idRol != 1) {
            res.json({ success: false, response: "No tiene permisos para esta función" })
        }
        let id = req.body.id;
        let result = await db.Productos.update(
            {
                estado: 1
            }, {
            where: {
                id: id
            }
        })
        res.json({ sucess: true, data: result });
    } catch (err) {
        res.status(500).json({ err: err, mensaje: 'Error trycatch' });
        console.error(err);
    }
});
ProductosController.post('/deactivate', async (req, res) => {
    try {
        let access = await hasAccess(req)
        if (!access.success) {
            res.status(400).json(access)
        }

        let idRol = access.model.rol

        if (idRol != 1) {
            res.json({ success: false, response: "No tiene permisos para esta función" })
        }
        let id = req.body.id;
        let result = await db.Productos.update(
            {
                estado: 0
            }, {
            where: {
                id: id
            }
        })
        res.json({ sucess: true, data: result });
    } catch (err) {
        res.status(500).json({ err: err, mensaje: 'Error trycatch' });
        console.error(err);
    }
});
ProductosController.post('/pagar', async (req, res) => {
    try {
        let total = req.body.total
        const params = new URLSearchParams();
        params.append("total", total);
        let pago = await axios.post(`http://localhost:3000/paypal/create-order`, params);
        res.json(pago.data.links[1].href)
    } catch (err) {
        res.status(500).json({ err: err, mensaje: 'Error trycatch' });
        console.error(err);
    }
});
ProductosController.post('/agendar-pedido', async (req, res) => {
    try {
        //agregar cantidad de cart
        let usuario = req.body.usuario;
        let productos = req.body.productos;
        let rol = req.body.usuario.rol;
        let code = generate_code()
        switch (rol) {
            case "3":
                //estados 1 administrador, 2 usuario registrado, 3 invitado
                let user = await db.Usuarios.create({ nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo, estado: 3 })
                for (let i = 0; i < productos.length; i++) {
                    let cantidad = productos[i].cantidad

                    let prod = await db.Productos.findByPk(productos[i].id)
                    let new_stock = prod.stock - cantidad

                    let total = cantidad * prod.p_venta
                    /* db.Productos.update({ stock: new_stock }, { where: { id: productos[i].id } }) */
                    let add = await user.addProductos(prod, { through: { cantidad: cantidad, total: total, codigo: code } })
                }
                res.json({ response: "Agregado" })
                break;

            case "2":
                //estados 1 administrador, 2 usuario registrado, 3 invitado
                //usuario si se registra verificar el estado q no sea invitado y el correo q no este registrado como usuario(crear usuario)


                let u = await db.Usuarios.findByPk(usuario.id)

                //descontar stock
                for (let i = 0; i < productos.length; i++) {
                    let cantidad = productos[i].cantidad

                    let prod = await db.Productos.findOne({ where: { id: productos[i].id } })
                    let descuento = prod.stock - cantidad

                    let total = cantidad * prod.p_venta
                    // format the body
                    db.Productos.update({ stock: descuento }, { where: { id: productos[i].id } })
                    u.addProductos(prod, { cantidad: cantidad, total: total, codigo: code })
                }
                break;
        }


    } catch (err) {
        res.status(500).json({ err: err, mensaje: 'Error trycatch' });
        console.error(err);
    }
});
ProductosController.post('/add-cart', async (req, res) => {
    try {
        let productos = req.body.product
        let cart = req.body.cart
        let total
        productos.forEach(producto => {
            if (cart.find(e => e.id == producto.id)) {
                cart.forEach(p => {
                    if (p.id == producto.id) {
                        p.cant = p.cant + producto.cant;
                        p.total = p.precio * p.cant
                    }
                })
            } else {
                cart.push({
                    "id": producto.id,
                    "nombre": producto.nombre,
                    /*  "img": prod.Imagenes[0].nombre, */
                    "cant": producto.cant,
                    "precio": producto.precio,
                    "total": producto.precio * producto.cant,
                })
            }
        })

        res.json({ success: true, message: "agregado", cart: cart });
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})
ProductosController.post('/delete-cart', async (req, res) => {
    try {
        let cart = req.body.carrito
        let id = req.body.id
        cart = cart.filter(function (p) {
            return p.id !== id;
        });
        res.json({ response: "Producto quitado", cart: cart })

    } catch (error) {
        console.log(error)
        res.json(error)
    }
})
ProductosController.post('/subtract-product', async (req, res) => {
    try {

        let id = req.body.id;
        let cart = req.body.cart;
        if (cart.find(e => e.id == id)) {
            cart.forEach(p => {
                if (p.id == id) {
                    p.cant = p.cant - 1;
                    p.total = p.total - p.precio

                    //si es 0 quitar producto
                    if (p.cant == 0) {
                        cart = cart.filter(function (p) {
                            return p.id !== id;
                        });
                    }
                }
            })
        }

        console.log(cart)
        res.json({ cart: cart });
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})
ProductosController.post('/add-product', async (req, res) => {
    try {

        let id = req.body.id;
        let cart = req.body.cart;
        let prod = await db.Productos.findByPk(id)


        if (cart.find(e => e.id == id)) {
            cart.forEach(p => {
                if (p.id == id) {
                    p.cant = p.cant + 1;
                    p.total = p.total + p.precio
                }
            })
        }

        console.log(cart)
        res.json({ cart: cart });
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

ProductosController.get('/search/:nombre/:limit', async (req, res) => {
    try {
        //limitar a :limit
        let nombre = req.params.nombre
        let limit = req.params.limit
        let result = await db.Productos.findAll({
            where: {
                nombre: {
                    [Op.like]: '%' + nombre + '%'
                }
            }
        })

        res.json({ productos: result })

    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

function generate_code() {
    var caracteres = "12346789";//rango de caracteres
    var code = "TD";
    for (i = 0; i < 10; i++) code += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return code;
}

module.exports = ProductosController