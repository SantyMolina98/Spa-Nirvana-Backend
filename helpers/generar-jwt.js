const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        //Generar el JWT
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' }, (err, token) => {
            if (err) {
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}