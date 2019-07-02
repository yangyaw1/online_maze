var NodeRSA = require('node-rsa')
var fs = require('fs')

function generator() {
  var key = new NodeRSA({ b: 512 })
  key.setOptions({ encryptionScheme: 'pkcs1' })
  console.log(key);

  var privatePem = key.exportKey('pkcs1-private-pem')
  var publicPem = key.exportKey('pkcs1-public-pem')
  console.log(privatePem);

  fs.writeFile('./pem/public.pem', publicPem, (err) => {
    if (err) throw err
    console.log('pubilc key stored！')
  })
  fs.writeFile('./pem/private.pem', privatePem, (err) => {
    if (err) throw err
    console.log('pravite key stored')
  })
}

generator();