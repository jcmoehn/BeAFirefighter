
//Autor: Jan-Christopher Möhn

const fs = require("fs");
const express = require('express');
const router = express.Router();
let mutex = 0;
let path;

// Fügt ein Aussen-Bild für ein Fahrzeug hinzu
router.post('/aussenImage', erstelleBild, (req, res) => {
  return res.status(200).send({ msg: 'super' })
});

// Bekommt ein Bild und speichert es für ein Fahrzeug
function erstelleBild(req, res, next) {
  console.log("erstelle Bild");
  console.log(req.query.Seite);
  console.log(req.query.Fahrzeugtyp);
  
  const fileStream = fs.createWriteStream('./src/' + req.query.Fahrzeugtyp + '/' + req.query.Seite + '.jpg')
  req.pipe(fileStream);
  fileStream.on('finish', function () {
    console.log('Done with erstelleBild');
    fileStream.close()
    next();
  });
}

// Erstellt die Ordner-Hirachie für ein Fahrzeug
function erstelleOrdner(req) {
  
  console.log("In Ordner");
  console.log(req.query.Fahrzeugtyp);
  fs.mkdirSync('./src/' + req.query.Fahrzeugtyp);
  fs.mkdirSync('./src/' + req.query.Fahrzeugtyp + '/links');
  fs.mkdirSync('./src/' + req.query.Fahrzeugtyp + '/rechts');
  fs.mkdirSync('./src/' + req.query.Fahrzeugtyp + '/hinten');
  fs.mkdirSync('./src/' + req.query.Fahrzeugtyp + '/oben');

  console.log('fertig mit erstelleOrnder');
}

// Fügt ein Zoom-Bild für ein Auto hinzu
router.post('/innenImage', erstelleZoomBild, (req, res) => {
  return res.status(200).send({ msg: 'super' })
});

// Bekommt ein Bild und speichert es für ein Fahrzeug
function erstelleZoomBild(req, res, next) {
  path = './src/' + req.query.Fahrzeugtyp + '/' + req.query.Seite + '/' + req.query.index + '.jpg';
  const fileStream = fs.createWriteStream(path);
  req.pipe(fileStream);
  fileStream.on('finish', function () {
    console.log('Done with erstelleZoomBild');
    fileStream.close()
    next();
  });
 
}

// Fügt das Preview-Bild für ein Auto hinzu
router.post('/previewImage', erstellePreviewBild, (req, res) => {
  erstelleOrdner(req);
  return res.status(200).send({ msg: 'super' })
});

// Bekommt das Previw-Bild und speichert es für ein Fahrzeug
function erstellePreviewBild(req, res, next) {
  path = './src/autoliste/' + req.query.Fahrzeugtyp + '.jpg';
  const fileStream = fs.createWriteStream(path);
  req.pipe(fileStream);
  fileStream.on('finish', function () {
    console.log('Done with erstellePreviewBild'); 
    fileStream.close()
    next();
  });
}

// Future-Work resize der Bilder
async function resizeBild(path) {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(resizeBild)
  await new Promise(resolve => setTimeout(resolve, 10000));

  const execSync = require('child_process').execSync;

  const output = execSync('mogrify -resize 1024x480' + path, { encoding: 'utf-8' });  // the default is 'buffer'
  console.log('Output was:\n', output);

}

module.exports = router;