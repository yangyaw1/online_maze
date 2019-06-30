var NodeRSA = require('node-rsa');
var fs = require('fs');
const RSA_public_key = fs.readFileSync('./pem/public.pem');
const RSA_private_key = fs.readFileSync('./pem/private.pem');
var jwt = require('jsonwebtoken');

const Token = jwt.sign({uid: 1}, RSA_private_key, {
                algorithm: 'RS256',
                expiresIn: 100,
            });
console.log(Token);            
jwt.verify(Token, RSA_public_key, {
    algorithm: 'RS256',
    expiresIn: 12000}, (err, decoded) => {
        if(err) {
            console.log('dismatch');
        } else {
            console.log(decoded);
        }
    });
