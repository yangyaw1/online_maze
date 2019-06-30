var crypto = require("crypto");
var salt = crypto.randomBytes(16).toString('base64');
var pass = 'kkr';
var a = crypto.createHash('sha1')
     .update(pass + salt)
     .digest('base64');
console.log(salt);
console.log(a);