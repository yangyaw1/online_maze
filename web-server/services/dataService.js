// const mazes = [{
//     id: 1,
//     graph: '0000001100010000111101101',
//     width: 5,
//     height: 5,
//     start: 7,
//     end: 24,
//     size: 'small'
// }];

// const users = [
//   {
//       uname: 'yyw',
//       uid: 1,
//       password: 'yyw'
//   },
//   {
//       uname: 'kkr',
//       uid: 2,
//       password: 'kkr'
//   }];
var redisClient = require('../modules/redisClient');
const TIMENOUT_IN_SECONDS = 3600;

const {mazemodel, usermodel} = require("../models/dataModel");
var crypto = require("crypto");

   
const getusers = function() {
    return new Promise((resolve, reject) => {
        usermodel.find({}, (err, users) => {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        });
    });
};

const getuser = function(uname) {
    return new Promise((resolve, reject) => {
        usermodel.findOne({uname: uname}, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

const adduser = function(newuser) {
    return new Promise((resolve, reject) => {
                usermodel.count({}, (err, count) => {
                    if(err){
                        reject('unexpected error!');
                    } else {
                       newuser.uid = count + 1;
                       newuser.salt = crypto.randomBytes(16).toString('base64');
                       newuser.hashedpw = crypto.createHash('sha1')
                               .update(newuser.password + newuser.salt)
                               .digest('base64');
                       delete newuser.password;
                       const mongouser = new usermodel(newuser);
                       mongouser.save();
                       resolve(mongouser);
                    }
                });
            });
};

const saveProcess = function(mazeid, uname, savedata){
    const key = mazeid + '#' + uname;
    const value = JSON.stringify(savedata);
    redisClient.set(key, value, redisClient.redisPrint);
};

const restoreProcess = function(mazeid, uname){
    const key = mazeid + '#' + uname;
    
    return new Promise((resolve, reject) => {
      redisClient.get(key, function(data){
           if(data){
               redisClient.del(key, function(res){
                   if(res){
                      resolve(JSON.parse(data)); 
                   } else {
                       reject('cannot delete key');
                   }
               });
           } else {
               reject('No restroed data');
           }
        }); 
    });
};

const getmazes = function() {
    return new Promise((resolve, reject) => {
        mazemodel.find({}, (err, mazes) => {
            if (err) {
                reject(err);
            } else {
                resolve(mazes);
            }
        });
    });
};

const getmaze = function(id) {
    return new Promise((resolve, reject) => {
        mazemodel.findOne({id: id}, (err, maze) => {
            if (err) {
                reject(err);
            } else {
                resolve(maze);
            }
        });
    });
};

module.exports = {
    getusers: getusers,
    getuser: getuser,
    adduser: adduser,
    getmazes: getmazes,
    getmaze: getmaze,
    saveProcess: saveProcess,
    restoreProcess: restoreProcess
};