const client = require('./rpc_client');

client.maze_creation(5, 5, result => {
    const info = JSON.parse(result)
    console.log(info.graph)
    console.log(info.start)
    console.log(info.end)
    // console.assert(result[0] === 2)
    // console.assert(result[1] === 7)
});