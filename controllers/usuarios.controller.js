const db = require('../models');
const express = require('express');
const UsuariosController = express();
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const checkToken = require('../pipes/Jwtva.pipe')

UsuariosController.get('/index', async (req, res) => {
    try {
        let list = await db.Usuarios.findAll()
        res.json({ response: "Listado Correctamente", lista: list });

    } catch (error) {
        console.log(error);
    }

})
UsuariosController.post('/create', async (req, res) => {
    try {
        /* let post = req.body.post; */
        let nombre = req.body.post.nombre;
        let apellidos = req.body.post.apellidos;
        let rol = req.body.post.rol;
        let correo = req.body.post.correo;
        let password = passwordHash.generate(req.body.post.password);

        let add = await db.Usuarios.create({
            nombre: nombre,
            apellidos: apellidos,
            rol: rol,
            correo: correo,
            password: password

        })
        res.json({ response: "Registrado Correctamente", model: add });

    } catch (error) {
        res.json(error)
        console.log(error);
    }

})

UsuariosController.post('/login', async (req, res) => {
    try {
        let model = await db.Usuarios.findOne({ where: { correo: req.body.correo } })

        if (passwordHash.verify(req.body.password, model.password)) {
            let date = new Date();
            let a = date.valueOf();
            let cadena = a.toString()
            let cadenaCorregida = cadena.substring(0, cadena.length - 3);
            let iat = parseInt(cadenaCorregida);
            let exp = iat + (3600 * 24 * 7)

            let key = 'jwt_data_keyCR1542';
            let token = {
                iat: iat,
                exp: exp,
                data: {
                    id: model.id,
                    email: model.correo,
                    rol: model.rol
                }
            };

            let jwt2 = jwt.sign(token, key);


            let updateResult = await db.Usuarios.update({
                token: jwt2
            }, {
                where: {
                    id: model.id
                }
            });
            if (updateResult) {

                return res.json({ success: true, response: 'Exito', token: jwt2, exp: exp, id: model.id, email: model.correo, rol: model.rol });
            }
        } else {
            res.status(404).json({ success: false, mensaje: "Usuario no encontrado" })
        }

    } catch (error) {
        res.status(500).json({ error: error, mensaje: 'Error trycatch' });
        console.log(error);
    }
})

UsuariosController.get('/islogged', async (req, res) => {
    try {
        let token = req.header('Authorization');

        let validator = await checkToken(token)
        if (!validator.success) {

            res.status(500).json({ success: false, message: "no tiene autorizacion" })
        }

        res.json({ success: true, model: validator.model })

    } catch (err) {
        res.status(500).json({ err: err, mensaje: 'Error trycatch' });
        console.error(err);
    }
})


UsuariosController.get('/logout', async (req, res) => {
    try {
        let token = req.header('Authorization');

        let validator = await checkToken(token)
        if (!validator.success) {

            res.status(500).json({ success: false, message: "no tiene autorizacion" })
        }

        let model = validator.model;

        if (model) {
            let logout = await db.Usuario.update({ token: null }, { where: { id: model.id } })

            if (logout) {
                res.json({ success: true, message: "Sesión cerrada" })

            } else {
                res.status(500).json({ success: false, message: "No se pudo cerrar sesión" })
            }
        } else {
            res.status(500).json({ success: false, message: "No se pudo cerrar sesión" })
        }


    } catch (err) {
        res.status(500).json({ err: err, mensaje: 'Error trycatch' });
        console.error(err);
    }
})

module.exports = UsuariosController