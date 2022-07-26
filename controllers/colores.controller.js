const db = require('../models');
const express = require('express');
const hasAccess = require('../pipes/autorizacion.pipe');
const ColoresController = express();

ColoresController.get('/index', async (req, res) => {
    try {
        let list = await db.Colores.findAll()
        res.json({ response: "Listado Correctamente", lista: list });

    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }

})

ColoresController.post('/create', async (req, res) => {
    try {
        let access = await hasAccess(req)
        if (!access.success) {
            res.status(400).json(access)
        }

        let idRol = access.model.rol

        if (idRol != 1) {
            res.json({ success: false, response: "No tiene permisos para esta función" })
        }
        let post = req.body.element
        let list = await db.Colores.create(post)
        res.json({ response: "Registrado Correctamente" });

    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }

})

ColoresController.put('/update', async (req, res) => {
    try {
        let access = await hasAccess(req)
        if (!access.success) {
            res.status(400).json(access)
        }

        let idRol = access.model.rol

        if (idRol != 1) {
            res.json({ success: false, response: "No tiene permisos para esta función" })
        }
        let id = req.body.element.id
        let post = req.body.element
        let model = db.Colores.findOne({ where: { id: id } })

        if (model) {
            let list = await db.Colores.update(post, { where: { id: id } })
            res.json({ response: "Modificado Correctamente", model: list });
        } else {
            res.status(404).json({ response: "No encontrado" })
        }
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }

})
ColoresController.delete('/delete', async (req, res) => {
    try {
        let access = await hasAccess(req)
        if (!access.success) {
            res.status(400).json(access)
        }

        let idRol = access.model.rol

        if (idRol != 1) {
            res.json({ success: false, response: "No tiene permisos para esta función" })
        }
        let id = req.body.element.id
        let model = db.Colores.findOne({ where: { id: id } })

        if (model) {
            let list = await db.Colores.destroy({ where: { id: id } })
            res.json({ response: "Eliminado Correctamente", model: list });
        } else {
            res.status(404).json({ response: "No encontrado" })
        }
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }

})
module.exports = ColoresController