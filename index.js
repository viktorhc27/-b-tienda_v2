const express = require("express");
const app = express();
const morgan = require("express");
const fs = require('fs')
const PORT = process.env.PORT || 3000;
const cors = require('cors');

var session = require('express-session');
var flash = require('express-flash-notification');
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
// session setup
app.use(session({ secret: "tienda", resave: true, saveUninitialized: true }));
app.use(flash(app));
app.use(cors())



// Middlewares: Morgan es para ver las peticiones que van llegando al servidor 
app.use(morgan('dev'));
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//inicio rutas 
app.get('/', function (req, res) {
    req.session.nombre = "victor"
    /*  if (req.session.cart == undefined) {
         req.session.cart = []
     }  */


    req.session.cart = [
        {
            "id": 13,
            "nombre": "mesa",
            "img": "imagen",
            "cant": 6,
            "precio": 10,
            "total": 60
        }
    ]
    res.json(req.session.nombre);
    console.log(req.session.cart)
});
app.use('/usuarios', require('./controllers/usuarios.controller'))
app.use('/productos', require('./controllers/productos.controller'))
app.use('/colores', require('./controllers/colores.controller'))
app.use('/paypal', require('./controllers/paypal.controller'))
//retorna la imagen desde el servidor
app.get('/:img', (req, res) => {
    try {
        let name = req.params.img
        if (fs.existsSync(__dirname + '/assets/files/' + name)) {
            //file exists
            res.sendFile(__dirname + `/assets/files/${name}`);
        }
        else {
            res.sendFile(__dirname + `/assets/files/no_img.jpg`);
        }
    } catch (err) {
        res.status(500).json(err);
        console.error(err)
    }

});

//fin rutas 
app.listen(PORT, function () {
    console.log(`La app ha arrancado en http://localhost:${PORT}`);
});