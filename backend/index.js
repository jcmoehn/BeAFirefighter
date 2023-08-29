//Autoren: Jan, Fabian
const http = require('http');
const bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors');
const path = require('path');


const port = 3000;
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const editor = require("./routes/editor.js");
const getdata = require("./routes/getdata.js");
const quiz = require("./routes/quiz.js");
const bilder = require("./routes/bilder.js");
const { Console } = require('console');

app.use("",editor)
app.use("",getdata)
app.use("",quiz)
app.use("",bilder)

let server = http.createServer(app);


server.on('connection', (socket) => {
  console.log('New Connection ...');
});

server.listen(port);
console.log('Listening on port ' + port);


//Ausführen der QUNIT Tests
app.get('/test', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'startetest.html'));
});

app.get('/unittests.js', function (req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'unittests.js'));

});


process.on('SIGINT', function () {
    console.log("Beenden des Backend Servers");
    process.exit();
  });
