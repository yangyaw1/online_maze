const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const dataService = require('../services/dataService');
const authService = require('../services/authService');

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

module.exports = router;