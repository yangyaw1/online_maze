var redisClient = require('../modules/redisClient');
const TIMENOUT_IN_SECONDS = 3600;

const createRoomid = function(){
    const key = 'CURRENT_ID_TO_CREATE';
    return new Promise((resolve, reject) => {
        redisClient.get(key, function(roomid){
            if(roomid){
                redisClient.set(key, +roomid+1, redisClient.redisPrint);
                resolve(roomid);
            } else {
                redisClient.set(key, 2, redisClient.redisPrint);
                resolve(1);
            }
        });
    });
};

const createRoom = function(uname, roomid, mazeid){
    const key = JSON.stringify({roomid: roomid});
    const user_key = JSON.stringify({uname: uname});
    return new Promise((resolve, reject) => {
        redisClient.get(user_key, function(userdata){
            if(userdata){
                reject('You already joined a room!');
            } else{
                redisClient.get(key, function(data){
                    if(data){
                        reject('Room is already created!');
                    } else {
                        const value = JSON.stringify({mazeid: mazeid, playerInside: 1});
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.set(user_key, true, redisClient.redisPrint);
                        resolve('Room is created successfully!');
                    }
                });
            }
        })
        
    });
};

const joinRoom = function(uname, roomid, mazeid){
    const key = JSON.stringify({roomid: roomid});
    const user_key = JSON.stringify({uname: uname});
    return new Promise((resolve, reject) => {
        redisClient.get(user_key, function(userdata){
            if(userdata){
                reject('You already joined a room!');
            } else{
                redisClient.get(key, function(data){
                    if(data){
                        reject('Room is already created!');
                    } else {
                            redisClient.get(key, function(data){
                                if(data){
                                    console.log('success');
                                    const info = JSON.parse(data);
                                    if(+info.playerInside !== 1){
                                        reject('The room is full.');
                                    } else if(+info.mazeid !== mazeid){
                                        reject('The room serves for a different maze');
                                    } else {
                                        const value = JSON.stringify({mazeid: mazeid, playerInside: 2});
                                        redisClient.set(key, value, redisClient.redisPrint);
                                        redisClient.set(user_key, true, redisClient.redisPrint);
                                        resolve('Join the room successfully!');
                                    }
                                } else {
                                    console.log('fail');
                                    reject('Such room does not exist!');
                                }
                            });
                    }
                });
            }
        })
        
    });
};

module.exports = {
    createRoomid: createRoomid,
    createRoom: createRoom,
    joinRoom: joinRoom
};