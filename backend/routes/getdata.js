//Autoren: Fabian
const db = require("../db.js");
const express = require('express');
const router = express.Router();




//Alle Fahrzeuge - Weitere Rout um nach Feuerwehr zu filtern (erwartet Feuerwehrname)
router.get('/getfahrzeug', async function (req, res) {
    console.log("In getfahrzeuge");
    db.query(`SELECT Fahrzeugtyp FROM Feuerwehrfahrzeuge ;`,
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result)
        res.status(200);
        console.log("Status gesetzt")
        return res.send({
          result
        }
        )
      }
    )
})
  
  
  //Bekommt fahrzeugtyp gibt beschreibung zurück
  router.get('/getbeschreibung', function (req, res) {
    console.log("In getbeschreibung");
  
    db.query(`SELECT Beschreibung FROM Fahrzeugtypen where Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' ;`,
      (err, result) => {
        if (err) {
          throw err;
        }
        return res.status(200).send({
          result
        }
        )
      }
    )
  })
  

  router.get('/getstandardwerkzeuge', function (req, res) {
  
    db.query(` Select distinct Geraetebezeichnung from Standardgeraetschaft ;`,
      (err, result) => {
        if (err) {
          throw err;
        }
        
        return res.status(200).send({
          result
        }
        )
      }
    )
  })

  router.get('/getsonderbeladung', function (req, res) {
  
    db.query(`Select distinct Geraetebezeichnung from Sonderbeladung ;`,
      (err, result) => {
        if (err) {
          throw err;
        }
        return res.status(200).send({
          result
        }
        )
      }
    )
  })

  router.get('/getallewerkzeuge', function (req, res) {
  
    db.query(`Select distinct Geraetebezeichnung from Standardgeraetschaft;`,
      (err, result) => {
        if (err) {
          throw err;
        }
        return res.status(200).send({
          result
        }
        )
      }
    )
  })
  

  router.get('/getbestandsliste', function (req, res) {
    console.log("In getbestandsliste");
  
    db.query(
      `SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet, Sonderbeladung.Geraetebezeichnung as Sondergeraet FROM (((((
        Feuerwehrfahrzeuge LEFT JOIN BeladungsID on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) 
        LEFT JOIN HitboxID on BeladungsID.HitboxID = HitboxID.HitboxID)
        LEFT JOIN Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID)
        LEFT JOIN Fachliste on HitboxID.FachID = Fachliste.FachID)
        LEFT JOIN Standardgeraetschaft on Fachliste.StandardID = Standardgeraetschaft.StandardID)
        LEFT JOIN Sonderbeladung on Sonderbeladung.SonderID = Fachliste.SonderID
        WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
        Torhitbox.RaumID = '${(req.query.RaumID)}' AND
        Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
        BeladungsID.Fachseite = '${(req.query.Fachseite)}' AND
        (Standardgeraetschaft.Geraetebezeichnung IS NOT NULL OR Sonderbeladung.Geraetebezeichnung IS NOT NULL);`,
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result);
        return res.status(200).send({
          result
  
        }
        )
      }
    )
  })
  
  //Abrufen der Hitboxen: -------------------------------------------------------------------------------------------------
  //Gibt die Hitboxen der Geräteräume einer Seite zurück
  //gethitboxraum (Fahrzeugtyp, Seite ("links"))
  router.get('/gethitboxraum', function (req, res) {
    console.log("In gethitbox");
  
    db.query(
      `Select RaumID, Koordinate, Pixel from 
            (Torhitbox inner join BeladungsID on Torhitbox.HitboxID = BeladungsID.HitboxID) 
            inner join Feuerwehrfahrzeuge on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID
            where Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' 
            AND Fachseite = '${(req.query.Fachseite)}' ;`,
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result);
  
        return res.status(200).send({
          result
        }
        )
      }
    )
  })
  
  //Gibt die Hitboxen der Schubladen eines Geräteraumes zurück.
  //Erwartet Fahrzeugtyp, Fachseite, RaumID (Die Lokale Id für die Seite eines Fahrzeugs) (In DB Torhitbox.RaumID)
  router.get('/gethitboxfach', function (req, res) {
    console.log("In gethitboxfach");
  
    db.query(
      `Select Fachliste.KoordinatenID, Fachliste.Koordinate, Fachliste.PixelFach from Fachliste 
            inner join HitboxID on Fachliste.FachID = HitboxID.FachID
            where HitboxID = 
            (Select Torhitbox.HitboxID from (Torhitbox 
            inner join BeladungsID on Torhitbox.HitboxID = BeladungsID.HitboxID) 
            inner join Feuerwehrfahrzeuge on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID 
            where Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' 
            AND Fachseite = '${(req.query.Fachseite)}'  
            AND Fachliste.PixelFach IS NOT NULL
            AND RaumID = '${(req.query.RaumID)}'  limit 1);`,
  
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result);
  
        return res.status(200).send({
          result
  
        }
        )
      }
    )
  })



//Websiten Icon
router.get('/icon', (request, response) => {
    response.status(200).download(`./src/icon/wagen1.webp`);
  })
  
  //Gibt die geschlossenen Seiten aus (name, seite)
  router.get('/auto', (request, response) => {
    response.status(200).download(`./src/${request.query.name}/${request.query.seite}.jpg`);
    //Hitboxen mitsenden
  })
  
  //Alle anderen Bildern (auto, ansicht, tor)
  router.get('/autoOffen', (request, response) => {
    console.log(request.query.auto)
    response.status(200).download(`./src/${request.query.auto}/${request.query.ansicht}/${request.query.tor}.jpg`);
  })
  
  //Für die Autoübersicht (Autotyp)
  router.get('/autoliste', (request, response) => {
    console.log(request.query.auto)
    response.status(200).download(`./src/autoliste/${request.query.auto}.jpg`);
  })


module.exports= router;