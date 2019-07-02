var redisClient = require('../modules/redisClient');

module.exports = function(io){
    var competitions = {};
    // map from socket Id to test Id
    var socketIdToRoomId = {};
    
    io.on('connection', (socket)=> {
        
       io.to(socket.id).emit('message', 'Hi from server');
       
       //map socketid to roomId
       var roomId = socket.handshake.query['roomId'];
       socketIdToRoomId[socket.id] = roomId;
       if(roomId in competitions){
           competitions[roomId]['participants'].push({name:'', id: socket.id, is_ready: false});
       } else {
           competitions[roomId] = {participants: [{name:'', id: socket.id, is_ready: false}], ready: 0, start: false};
       }
       
       // when opponent connects
       socket.on('oppo_connect', (uname) =>{
           let roomId = socketIdToRoomId[socket.id];
           console.log('new user ' + uname + ' at room: ' + roomId);
           if(roomId in competitions){
              let participants = competitions[roomId]['participants'];
              for(let i = 0; i < participants.length; i++){
                  if(participants[i].id !== socket.id){
                     io.to(participants[i].id).emit('oppo_connect', uname);
                     io.to(socket.id).emit('oppo_connect', participants[i].name);
                     if(competitions[roomId]['ready'] === 1){
                         io.to(socket.id).emit('ready', true);
                     }
                  } else {
                     participants[i].name = uname;
                  }
              }
           } else {
               console.log('no room found!');
           }
       });
       
       // when opponent is ready
       socket.on('ready', (is_waiting) =>{
           let roomId = socketIdToRoomId[socket.id];
           competitions[roomId].ready ++;
           console.log(competitions[roomId].ready);
           if(roomId in competitions){
               let participants = competitions[roomId]['participants'];
               for(let i = 0; i < participants.length; i++){
                   if(participants[i].id === socket.id){
                      participants[i].is_ready = true;
                   }
                   if(competitions[roomId].ready === 2){
                      io.to(participants[i].id).emit('countdown', is_waiting);
                      competitions[roomId].start = true;
                   } else if(participants[i].id !== socket.id){
                      io.to(participants[i].id).emit('ready', is_waiting);
                   }
               }
            } else {
                console.log('no room found!');
            }
       });
       
       // when one player finished the game
       socket.on('gameend', (timecount) =>{
           let roomId = socketIdToRoomId[socket.id];
           competitions[roomId].ready = 0;
           if(roomId in competitions){
               let participants = competitions[roomId]['participants'];
               for(let i = 0; i < participants.length; i++){
                   participants[i].is_ready = false;
                   io.to(participants[i].id).emit('gameend', timecount);
               }
            } else {
                console.log('no room found!');
            }
       });
       
       // when opponent change position
       socket.on('updateLocation', (cur) =>{
           let roomId = socketIdToRoomId[socket.id];
           if(roomId in competitions){
              let participants = competitions[roomId]['participants'];
              for(let i = 0; i < participants.length; i++){
                  if(participants[i].id !== socket.id){
                     io.to(participants[i].id).emit('updateLocation', cur);
                  }
              }
           } else {
               console.log('no room found!');
           }
       });
       
       // response to disconnect event
       socket.on('disconnect', ()=>{
          let roomId = socketIdToRoomId[socket.id];
              if(roomId in competitions){
                  let participants = competitions[roomId]['participants'];
                  let index = -1;
                  if(participants[0].id === socket.id){
                      index = 0;
                  } else if(participants[1].id === socket.id){
                      index = 1;
                  }
                  if(index >= 0) {
                     if(competitions[roomId].start){
                         competitions[roomId].ready = 0;
                     } 
                     if(participants[index].is_ready && competitions[roomId].ready > 0){
                         competitions[roomId].ready --;
                     }
                     var user_key = JSON.stringify({uname: participants[index].name});
                     redisClient.del(user_key, redisClient.redisPrint);
                     participants.splice(index, 1);
                     var key = JSON.stringify({roomid: roomId});
                     if(participants.length > 0){
                         for(let i = 0; i < participants.length; i++){
                            io.to(participants[i].id).emit('oppo_disconnect', 'opponent disconnecs');
                         }
                         redisClient.get(key, function(data){
                              if(data){
                               const info = JSON.parse(data);
                               const value = JSON.stringify({mazeid: info.mazeid, playerInside: 1});
                               redisClient.set(key, value, redisClient.redisPrint);
                              }
                         });
                     } else {
                         redisClient.del(key, redisClient.redisPrint);
                         delete competitions[roomId];
                         delete socketIdToRoomId[roomId];
                     }
                  } else {
                     console.log('cannot find socketid!');
                  }
              } else {
                  console.log('cannot find roomId!');
              }
       });
    });
};