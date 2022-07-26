const db = require('../models');
const jwt = require('jsonwebtoken');
async function checkToken(token) {
    try {
        let date = new Date().valueOf();
        let cadena = date.toString()
        let cadenaCorregida = cadena.substring(0, cadena.length - 3);
        let time = parseInt(cadenaCorregida);

        let key = 'jwt_data_keyCR1542';


        decode = jwt.decode(token, key, 'HS256');

        let model = await db.Usuarios.findOne({
            where: {
                id: decode.data.id
            }
        })

        if (decode.exp > time) {
            return { success: true, model: model };
        } else {
            
            return { success: false, response: 'No tiene permisos para esta función.' }
        }

    } catch (error) {

    }
}
module.exports = checkToken;


