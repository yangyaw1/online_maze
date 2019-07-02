const express = require('express');
const app = express();
const path = require("path");
const restRouter = require("./routes/rest.js");
var socketIO = require('socket.io');
var io = socketIO();
var competitionService = require('./services/competitionService')(io);
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var http = require('http');
var fs = require('fs');

const RSA_public_key = fs.readFileSync('./pem/public.pem');
const RSA_private_key = fs.readFileSync('./pem/private.pem');

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://yangya:yangya@mazecluster-behmn.azure.mongodb.net/maze");

app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public')));

// app.listen(8080, () => {
//     console.log('App is listing to port 8080');
// });

const server = http.createServer(app);
io.attach(server);
server.listen(8080);
server.on('listening', () => {
    console.log('App is listing to port 8080');
});

app.use((req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});