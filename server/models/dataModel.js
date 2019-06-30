const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    uname : String,
    uid: Number,
    salt: String,
    hashedpw: String
}, {collection: 'usermodel'});

const mazeSchema = mongoose.Schema({
    id: Number,
    graph: String,
    width: Number,
    height: Number,
    start: Number,
    end: Number,
    size: String
}, {collection: 'mazemodel'});


const mazemodel = mongoose.model('Mazemodel', mazeSchema);

const usermodel = mongoose.model('Usermodel', userSchema);
module.exports = {
    mazemodel: mazemodel,
    usermodel: usermodel
};