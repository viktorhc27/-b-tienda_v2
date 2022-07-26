const db = require('../models');
const express = require('express');
const hasAccess = require('../pipes/autorizacion.pipe');
const CategoriasController = express();

CategoriasController.get('/index', async (req, res) => {
    try {
        let list = await db.Categorias.findAll()
        res.json({ response: "Listado Correctamente", data: list });
    } catch (error) {
        res.status(500).json({ err: error, mensaje: 'Error trycatch' })
        console.log(error);
    }

})

CategoriasController.get('/create', async (req, res) => {
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
        let list = await db.Categorias.create(post)
        res.json({ response: "Listado Correctamente", data: list });
    } catch (error) {
        res.status(500).json({ err: error, mensaje: 'Error trycatch' })
        console.log(error);
    }

})

CategoriasController.get('/update', async (req, res) => {
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
        let list = await db.Categorias.update(post, { where: { id: post.id } })
        res.json({ response: "Listado Correctamente", data: list });
    } catch (error) {
        res.status(500).json({ err: error, mensaje: 'Error trycatch' })
        console.log(error);
    }

})

module.exports = CategoriasController;