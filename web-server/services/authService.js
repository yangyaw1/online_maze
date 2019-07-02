const {usermodel} = require("../models/dataModel");
var crypto = require("crypto");
var NodeRSA = require('node-rsa');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var fs = require('fs');

const RSA_public_key = fs.readFileSync('./pem/public.pem');
const RSA_private_key = fs.readFileSync('./pem/private.pem');

const userpwcheck = function(newuser) {
    return new Promise((resolve, reject)=>{
        usermodel.findOne({uname: newuser.uname}, (err, user) => {
            if (err) {
                reject(err);
            } else {
                if(!user){
                    reject('Cannot find username');
                } else{
                   const cipherpassword = crypto.createHash('sha1')
                                          .update(newuser.password + user.salt)
                                          .digest('base64');
                   console.log(cipherpassword);
                   console.log(user.hashedpw);
                   if (cipherpassword !== user.hashedpw) {
                       reject('Incorrect password');
                   } else {
                       resolve(user);
                   }
               }
            }
        });
    });
};


const login = function(newuser) {
    return new Promise((resolve, reject) => {
        userpwcheck(newuser).then(res=> {
            const jwtBearerToken = jwt.sign({uname: res.uname}, RSA_private_key, {
                algorithm: 'RS256',
                expiresIn: 86400,
            });
            resolve({
                 idToken: jwtBearerToken, 
                 uname: newuser.uname,
                 expiresIn: 86400
            });
          },
          err => {
            reject(err);
          });
    });
};

const signin = function(newuser) {
    return new Promise((resolve, reject) => {
        usermodel.findOne({uname: newuser.uname}, (err, user) => {
            if (err) {
                reject(err);
            } else {
                if(user){
                    reject('useralready exists!');
                } else {
                    const jwtBearerToken = jwt.sign({uname: newuser.uname}, RSA_private_key, {
                          algorithm: 'RS256',
                          expiresIn: 86400,
                         });
                         resolve({
                         idToken: jwtBearerToken, 
                         uname: newuser.uname,
                         expiresIn: 86400
                         });
                }
            }
        });
    });
};

const tokenCheck = function(token, uname){
    return new Promise((resolve, reject) => {
        jwt.verify(token, RSA_public_key, {
                algorithm: 'RS256',
                expiresIn: 86400,
            }, (err, decoded) => {
                if(err) {
                    reject(err);
                } else {
                    if(decoded.uname !== uname){
                        reject('wrong user');
                    } else {
                        resolve('correct');
                    }
                }
            })
    })
}
// const Tokencheck = function(token) {
//     jwt.verify(token, RSA_public_key, {uname: }, function(err, decoded) {
//   // if audience mismatch, err == invalid audience
// });
// }

module.exports = {
    login: login,
    signin: signin,
    userpwcheck: userpwcheck,
    tokenCheck: tokenCheck
}