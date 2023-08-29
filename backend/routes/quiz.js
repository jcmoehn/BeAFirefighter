//Autoren: Emanuel, Fabian
const db = require("../db.js");
const express = require('express');
const router = express.Router();


//Für das Quiz -------------------------------------------------------------------------------

//Gibt ein zufälliges Werkzeug eines übergeben Fahrzeuges zurück
router.get('/getzufaelligeswerkzeug', function (req, res) {
  console.log("In getzufaelligeswerkzeug");
  console.log("Fahrzeugtyp: ");
  console.log(`'${(req.query.Fahrzeugtyp)}'`);
  db.query(
    `SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet, Sonderbeladung.Geraetebezeichnung as Sondergeraet 
    FROM (((((
      Feuerwehrfahrzeuge LEFT JOIN BeladungsID on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) 
      LEFT JOIN HitboxID on BeladungsID.HitboxID = HitboxID.HitboxID)
      LEFT JOIN Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID)
      LEFT JOIN Fachliste on HitboxID.FachID = Fachliste.FachID)
      LEFT JOIN Standardgeraetschaft on Fachliste.StandardID = Standardgeraetschaft.StandardID)
      LEFT JOIN Sonderbeladung on Sonderbeladung.SonderID = Fachliste.SonderID
      WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}'
          
        Order by RAND() Limit 1;`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result)
      return res.status(200).send({
        result
      }
      )
    }
  )
})

router.get('/getantwort', function (req, res) {
  //herauszufinden, ob Werkzeug richtig ausgewählt wurde
 
  console.log("In getAntwort");
 
  console.log(`'${(req.query.Fahrzeugtyp)}'`);
  console.log(`'${(req.query.RaumID)}'`);
  console.log(`'${(req.query.KoordinatenID)}'`);
  console.log(`'${(req.query.Fachseite)}'`);
  let tool = req.query.Werkzeug;
  
  db.query(`SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet, Sonderbeladung.Geraetebezeichnung as Sondergeraet  FROM (((((
    Feuerwehrfahrzeuge LEFT JOIN BeladungsID on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) 
    LEFT JOIN HitboxID on BeladungsID.HitboxID = HitboxID.HitboxID)
    LEFT JOIN Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID)
    LEFT JOIN Fachliste on HitboxID.FachID = Fachliste.FachID)
    LEFT JOIN Standardgeraetschaft on Fachliste.StandardID = Standardgeraetschaft.StandardID)
    LEFT JOIN Sonderbeladung on Sonderbeladung.SonderID = Fachliste.SonderID
      WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
      Torhitbox.RaumID = '${(req.query.RaumID)}' AND
      Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
      BeladungsID.Fachseite = '${(req.query.Fachseite)}';`,
    (err, result) => {
      if (err) {
        console.log("Vor error getantwort");
        throw err;
      }

      console.log(result);
      for (let i = 0; i < Object.keys(result).length; i++) {
        console.log(tool+"="+result[i].Standardgeraet+ " oder " + tool + " = "+ result[i].Sondergeraet)
        console.log("--------------");
        if (result[i].Standardgeraet === tool || result[i].Sondergeraet === tool) {
          console.log("Richtige Antwort")
          return res.status(200).send({ "antwort": "richtig" });
        } 
      }
      return res.status(200).send({
        "antwort": "falsch"
      }
      )
    }
  )
})

//Gibt Alle Werkzeuge eines übergebenen Faches zurück (Standard und Sonderbeladung)
router.get('/getantwort2', function (req, res) {

  console.log("In getAntwort");
 
  console.log(`'${(req.query.Fahrzeugtyp)}'`);
  console.log(`'${(req.query.RaumID)}'`);
  console.log(`'${(req.query.KoordinatenID)}'`);
  console.log(`'${(req.query.Fachseite)}'`);
  let tool = req.query.Werkzeug;
  console.log("In getAntwort");
  db.query(`SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet
  FROM (((((
    Feuerwehrfahrzeuge LEFT JOIN BeladungsID on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) 
    LEFT JOIN HitboxID on BeladungsID.HitboxID = HitboxID.HitboxID)
    LEFT JOIN Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID)
    LEFT JOIN Fachliste on HitboxID.FachID = Fachliste.FachID)
    LEFT JOIN Standardgeraetschaft on Fachliste.StandardID = Standardgeraetschaft.StandardID)
    LEFT JOIN Sonderbeladung on Sonderbeladung.SonderID = Fachliste.SonderID
      WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
      Torhitbox.RaumID = '${(req.query.RaumID)}' AND
      Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
      BeladungsID.Fachseite = '${(req.query.Fachseite)}'
      AND Standardgeraetschaft.Geraetebezeichnung IS NOT NULL
      
      UNION

      SELECT Distinct Sonderbeladung.Geraetebezeichnung as Sondergeraet FROM (((((
        Feuerwehrfahrzeuge LEFT JOIN BeladungsID on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) 
        LEFT JOIN HitboxID on BeladungsID.HitboxID = HitboxID.HitboxID)
        LEFT JOIN Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID)
        LEFT JOIN Fachliste on HitboxID.FachID = Fachliste.FachID)
        LEFT JOIN Standardgeraetschaft on Fachliste.StandardID = Standardgeraetschaft.StandardID)
        LEFT JOIN Sonderbeladung on Sonderbeladung.SonderID = Fachliste.SonderID
        WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
        Torhitbox.RaumID = '${(req.query.RaumID)}' AND
        Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
        BeladungsID.Fachseite = '${(req.query.Fachseite)}'
        AND Sonderbeladung.Geraetebezeichnung IS NOT NULL;
      
      `,(err, result) => {
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


router.get('/getkorrekteantwort', function (req, res) {
  // herauszufinden, ob Werkzeug richtig ausgewählt wurde. Gibt die korrekte Antwort zurück
  db.query(`SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet, Sonderbeladung.Geraetebezeichnung as Sondergeraet, BeladungsID.Fachseite as Fachseite, Fachliste.KoordinatenID as KoordinatenID, Torhitbox.RaumID as RaumID 
  FROM (((((
    Feuerwehrfahrzeuge LEFT JOIN BeladungsID on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) 
    LEFT JOIN HitboxID on BeladungsID.HitboxID = HitboxID.HitboxID)
    LEFT JOIN Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID)
    LEFT JOIN Fachliste on HitboxID.FachID = Fachliste.FachID)
    LEFT JOIN Standardgeraetschaft on Fachliste.StandardID = Standardgeraetschaft.StandardID)
    LEFT JOIN Sonderbeladung on Sonderbeladung.SonderID = Fachliste.SonderID
        WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
        (Standardgeraetschaft.Geraetebezeichnung = '${(req.query.Werkzeug)}' OR
        Sonderbeladung.Geraetebezeichnung = '${(req.query.Werkzeug)}');`, 
    (err, result) => {
      if (err) {
        console.log("Vor error getantwort");
        throw err;
      }
     
      return res.status(200).send({
        result
      }
      )
    }
  )
})


//gibt ein zufälliges befüllte Fach eines Fahrzeuges zurück
router.get('/getrandomFach', function (req, res) {
  console.log("in getrandomfach");
  db.query(`
    Select Distinct BeladungsID.Fachseite, Torhitbox.RaumID, Fachliste.KoordinatenID, Fachliste.StandardID, Fachliste.SonderID
      From  ((((Fachliste INNER JOIN HitboxID on Fachliste.FachID = HitboxID.FachID) INNER JOIN BeladungsID 
      on HitboxID.HitboxID = BeladungsID.HitboxID) LEFT JOIN Torhitbox 
      on HitboxID.HitboxID = Torhitbox.HitboxID) INNER JOIN Feuerwehrfahrzeuge 
      on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID)
        where 
        (Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}'
        AND (Fachliste.StandardID IS NOT NULL OR Fachliste.SonderID IS NOT NULL) )
          Order by RAND() Limit 1;`,
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

//querry für Werkzeug des Fachs + Zufälliges Werkzeug (1 Richtiges + 4 Falsche)
router.get('/getauswahlmoeglichkeit', function (req, res) {
  console.log("in getauswahlmoeglichkeit")
  console.log(`'${(req.query.Fahrzeugtyp)}'`);
  console.log(`'${(req.query.RaumID)}'`);
  console.log(`'${(req.query.KoordinatenID)}'`);
  console.log(`'${(req.query.Fachseite)}'`);

  /*
  Zuerst werden alle Standardgeraetschaften und Sondergeraetschaften vereint (Union) die sich in dem Fach befinden, 
  dann werden sie gemischt und das erste ist die "Lösung"
  Danach werden alle Geräte rausgesucht, die sich nicht in dem Fach befinden und vereint (Sonder + Standardgeraete).
  Von sowohl der Standart wie auch der Sonderbeladung (Werden wieder vereinigt)
  Diese Vereinte Liste der "falschen Geräte" wird gemischt
  Danach hängen wir die "falschen Geräte" an die richtige Antwort und limitieren  die Liste auf 5 Ergebnisse.
  (1. In der Liste richtig 4 darauffolgende Falsch)
  Diese werden zum Schluss nochmal durchgemischt.
  */
  db.query(`
    SELECT * FROM(
      SELECT * FROM (
        SELECT * FROM (
          SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet
                  FROM (((((Standardgeraetschaft INNER JOIN Fachliste 
                  on Standardgeraetschaft.StandardID = Fachliste.StandardID) INNER JOIN HitboxID 
                  on Fachliste.FachID = HitboxID.FachID) INNER JOIN Torhitbox 
                  on HitboxID.HitboxID = Torhitbox.HitboxID) INNER JOIN BeladungsID 
                  on HitboxID.HitboxID = BeladungsID.HitboxID) INNER JOIN Feuerwehrfahrzeuge 
                  on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) Left JOIN Sonderbeladung 
                  on Fachliste.SonderID = Sonderbeladung.SonderID
                    WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
                    Torhitbox.RaumID = '${(req.query.RaumID)}' AND
                    Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
                    BeladungsID.Fachseite = '${(req.query.Fachseite)}' AND
                    Standardgeraetschaft.Geraetebezeichnung IS NOT NULL
          
          Union
          
          SELECT Distinct Sonderbeladung.Geraetebezeichnung as Sondergeraet 
            FROM ((((Fachliste INNER JOIN HitboxID on Fachliste.FachID = HitboxID.FachID) INNER JOIN Torhitbox 
            on HitboxID.HitboxID = Torhitbox.HitboxID) INNER JOIN BeladungsID 
            on HitboxID.HitboxID = BeladungsID.HitboxID) INNER JOIN Feuerwehrfahrzeuge 
            on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) Left JOIN Sonderbeladung 
            on Fachliste.SonderID = Sonderbeladung.SonderID
              WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
              Torhitbox.RaumID = '${(req.query.RaumID)}' AND
              Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
              BeladungsID.Fachseite = '${(req.query.Fachseite)}' AND
              Sonderbeladung.Geraetebezeichnung IS NOT NULL
                Order by RAND() Limit 1
          
        ) as tab1
          
        UNION
          
        SELECT * FROM (
          SELECT Distinct Standardgeraetschaft.Geraetebezeichnung as Standardgeraet
            FROM (((((Standardgeraetschaft INNER JOIN Fachliste 
                  on Standardgeraetschaft.StandardID = Fachliste.StandardID) INNER JOIN HitboxID 
                  on Fachliste.FachID = HitboxID.FachID) INNER JOIN Torhitbox 
                  on HitboxID.HitboxID = Torhitbox.HitboxID) INNER JOIN BeladungsID 
                  on HitboxID.HitboxID = BeladungsID.HitboxID) INNER JOIN Feuerwehrfahrzeuge 
                  on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) Left JOIN Sonderbeladung 
                  on Fachliste.SonderID = Sonderbeladung.SonderID
                    WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
                    Standardgeraetschaft.Geraetebezeichnung IS NOT NULL AND
                    Fachliste.FachID != 
                      (Select Distinct Fachliste.FachID 
                        From ((((Feuerwehrfahrzeuge INNER JOIN BeladungsID 
                          on Feuerwehrfahrzeuge.FahrzeugID = BeladungsID.FahrzeugID) INNER JOIN HitboxID 
                          on BeladungsID.HitboxID = HitboxID.HitboxID) INNER JOIN Fachliste 
                          on HitboxID.FachID = Fachliste.FachID) INNER JOIN 
                          Torhitbox on HitboxID.HitboxID = Torhitbox.HitboxID)
                            WHERE 
                            Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
                            Torhitbox.RaumID = '${(req.query.RaumID)}' AND
                            Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
                            BeladungsID.Fachseite = '${(req.query.Fachseite)}'
                              Limit 1)
          UNION
          
          SELECT Distinct Sonderbeladung.Geraetebezeichnung as Sondergeraet
            FROM ((((Fachliste INNER JOIN HitboxID on Fachliste.FachID = HitboxID.FachID) INNER JOIN Torhitbox 
            on HitboxID.HitboxID = Torhitbox.HitboxID) INNER JOIN BeladungsID on 
            HitboxID.HitboxID = BeladungsID.HitboxID) INNER JOIN Feuerwehrfahrzeuge 
            on BeladungsID.FahrzeugID = Feuerwehrfahrzeuge.FahrzeugID) Left JOIN 
            Sonderbeladung on Fachliste.SonderID = Sonderbeladung.SonderID
              WHERE Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
              Sonderbeladung.Geraetebezeichnung IS NOT NULL AND
              Fachliste.FachID != 
                (Select Distinct Fachliste.FachID 
                From ((((Feuerwehrfahrzeuge inner join BeladungsID 
                on Feuerwehrfahrzeuge.FahrzeugID = BeladungsID.FahrzeugID) INNER JOIN HitboxID 
                on BeladungsID.HitboxID = HitboxID.HitboxID) INNER JOIN Fachliste 
                on HitboxID.FachID = Fachliste.FachID) INNER JOIN Torhitbox 
                on HitboxID.HitboxID = Torhitbox.HitboxID)
                  WHERE 
                  Fahrzeugtyp = '${(req.query.Fahrzeugtyp)}' AND
                  Torhitbox.RaumID = '${(req.query.RaumID)}' AND
                  Fachliste.KoordinatenID = '${(req.query.KoordinatenID)}' AND
                  BeladungsID.Fachseite = '${(req.query.Fachseite)}'
                    Limit 1)
           )as tab2
        )AS AlleAntworten
      LIMIT 5
      ) as bugfix
    Order by RAND()
          ;`,
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


module.exports = router;



