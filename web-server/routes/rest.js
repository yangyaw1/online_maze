const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const dataService = require('../services/dataService');
const authService = require('../services/authService');
const roomService = require('../services/roomService');

router.get('/mazes', (req, res) => {
    dataService.getmazes()
      .then(mazes => {
          res.json(mazes);
      }, error => {
          res.status(400).send("unexpected error!");
      });
});

router.get('/mazes/:id', (req, res) => {
    const id = req.params.id;
    dataService.getmaze(+id)
      .then(maze => {
          res.json(maze);
      }, error => {
          res.status(400).send("Invalid maze ID!");
      });
});
router.post('/mazes', jsonParser, (req, res) => {
    const maze = req.body;
    console.log('coming to create maze!');
    console.log(maze);
    res.json(maze);
});

router.get('/users', (req, res) => {
    dataService.getusers()
      .then(users => {
          res.json(users);
      }, error => {
          res.status(400).send("unexpected error!");
      });
});

router.get('/users/:uname', (req, res) => {
    const uname = req.params.uname;
    dataService.getuser(uname)
      .then(user => {
          res.json(user);
      }, error => {
          res.status(400).send("User name does not exist!");
      });
});

router.post('/login', jsonParser, (req, res) => {
    console.log(req.body);
    authService.login(req.body)
       .then(auth => {
         res.json(auth);
       }, error => {
         res.status(401).send("Username or Password dismatch!");
       });
});

router.post('/signin', jsonParser, (req, res) => {
    console.log(req.body);
    authService.signin(req.body)
       .then(auth => {
           dataService.adduser(req.body)
            .then(data =>{
               res.json(auth);
            }, error => {
               res.status(400).send("Cannot create new user!");
            });
       }, error => {
         res.status(401).send("Username already exists!");
       });
});

router.post('/auth/:uname', jsonParser, (req, res) => {
    const uname = req.params.uname;
    const token = req.body.message;
    authService.tokenCheck(token, uname)
        .then(auth => {
            res.json(auth);
        }, error => {
            res.status(401).send('Unautherized!');
        });
});

router.post('/process/:mazeid/:uname', jsonParser, (req, res) => {
    const mazeid = req.params.mazeid;
    const uname = req.params.uname;
    dataService.saveProcess(mazeid, uname, req.body);
});

router.get('/process/:mazeid/:uname', (req, res) => {
    const mazeid = req.params.mazeid;
    const uname = req.params.uname;
    dataService.restoreProcess(mazeid, uname)
            .then(data => {
                res.json(data);
            }, error => {
                res.status(400).send('no such data');
            });
});

router.get('/rooms', (req, res) => {
    roomService.createRoomid()
        .then(roomid => {
            res.json({content: roomid});
        }, error => {
            res.status(400).send('unable to create roomid!');
        });
});

router.post('/rooms/create/:uname', jsonParser, (req, res) => {
    const uname = req.params.uname;
    const mazeid = req.body.mazeid;
    const roomid = req.body.roomid;
    roomService.createRoom(uname, roomid, mazeid)
        .then(message => {
            res.json({content: message});
        }, error => {
            res.status(400).send('Room is already created!');
        });
});

router.post('/rooms/join/:uname', jsonParser, (req, res) => {
    const uname = req.params.uname;
    const mazeid = req.body.mazeid;
    const roomid = req.body.roomid;
    roomService.joinRoom(uname, roomid, mazeid)
        .then(message => {
            res.json({content: message});
        }, error => {
            res.status(400).send('Room is avaliable!');
        });
});

module.exports = router;