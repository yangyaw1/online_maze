const jayson = require('jayson');
 
// create a client
const client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

function maze_creation(width, height, callback){
    client.request('maze_creation', [width, height], (err, response) => {
        if(err) throw err;
        callback(response.result);
    });
}
 
module.exports = {
    maze_creation: maze_creation
}