// Autoren: Felix, Fabian
const db = require("../db.js");
const express = require('express');
const router = express.Router();
const fs = require("fs");
const app = express;

//EDITOR Fahrzeug Anlegen --------------------------------------------------------------------------------------------


let mutex = 0;             //0= frei, 1=besetzt
let fahrzeugvorhanden = 0; //0 = existiert noch nicht, 1 = existiert
let status = 500;
let werkzeugeinnen;
let sonderwerkzeugeinnen;

router.post('/newEditorentry', async function (req, res) {

  console.log(req.body);

  try {
    console.log("In new Editor");

    if (req.body.type == '') { //hat jan gemacht
      throw new Error("Fahrzeugname ist leer");
    }

    const seite = ["links", "hinten", "rechts", "oben"];
    let RaumID;
    let fachseite;
    let pixelaussen;
    let pixelinnen;
    let KoordinatenID;

    mutex = 1;
    fahrzeugvorhanden = 0;
    await existiertFahrzeug(req);
    while (mutex === 1) {
      await new Promise(resolve => setTimeout(resolve, 5));
    };

    if (fahrzeugvorhanden === 0) {

      console.log("Fahrzeug existiert noch nicht")
      await new Promise(resolve => setTimeout(resolve, 2000));

      mutex = 1;
      await newFahrzeug(req);
      while (mutex === 1) {
        await new Promise(resolve => setTimeout(resolve, 5));
      };

      //Läuft über jede Seite des Fahrzeugs
      for (let ind = 0; ind < seite.length; ind++) {

        req.Fachseite = seite[ind];
        req.seitearray = null;

        //die richtige Seite finden, um herausfinden zu können was für ein req wir brauchen
        if (req.Fachseite === 'links') req.seitearray = req.body.links;
        if (req.Fachseite === 'hinten') req.seitearray = req.body.hinten;
        if (req.Fachseite === 'rechts') req.seitearray = req.body.rechts;
        if (req.Fachseite === 'oben') req.seitearray = req.body.oben;
        if (req.seitearray.hitBoxen === null) req.seitearray = null;             //Wenn äußere Hitboxen = null, kann es auch keine inneren haben

        console.log("Seite: " + req.Fachseite);
        console.log(req.seitearray);

        if (req.seitearray !== null) console.log("Array ist nicht leer");

        //läuft über jeden Geräteraum einer Seite
        for (let i = 0; req.seitearray !== null && i < req.seitearray.hitBoxen.length; i++) {

          console.log("N Hitboxen: " + req.seitearray.hitBoxen.length);

          fachseite = req.Fachseite;
          RaumID = i;
          pixelaussen = req.seitearray.hitBoxen

          mutex = 1; //sperren
          await Hitboxanlegen(req, fachseite, RaumID, pixelaussen);

          //mutex besetzt, bis freigegeben
          while (mutex === 1) {
            await new Promise(resolve => setTimeout(resolve, 5));
          };

          console.log("Zu den Zoomboxen");
          console.log(req.seitearray.zoomBoxen);

          for (let j = 0; typeof req.seitearray.zoomBoxen[RaumID] !== "undefined" && j < req.seitearray.zoomBoxen[RaumID].length; j++) {

            console.log("Pixel innen");
            console.log(req.seitearray.zoomBoxen[RaumID][j]);
            pixelinnen = req.seitearray.zoomBoxen[RaumID][j];

            //Checken, ob Standardwerkzeuge an dieser Stelle not undefined
            if (typeof req.seitearray.werkzeuge !== "undefined")
              if (typeof req.seitearray.werkzeuge[RaumID] !== "undefined")
                if (typeof req.seitearray.werkzeuge[RaumID][j] !== "undefined")
                  werkzeugeinnen = req.seitearray.werkzeuge[RaumID][j]; //Auf not null überprüfen

            //Checken, ob Standardwerkzeuge an dieser Stelle not undefined
            if (typeof req.seitearray.sonderwerkzeuge !== "undefined")
              if (typeof req.seitearray.sonderwerkzeuge[RaumID] !== "undefined")
                if (typeof req.seitearray.sonderwerkzeuge[RaumID][j] !== "undefined") 
                  sonderwerkzeugeinnen = req.seitearray.sonderwerkzeuge[RaumID][j];// Auf not null überprüfen
                
                
            KoordinatenID = (j + 100);
            console.log("Variabeln gesetzt");

            mutex = 1;
            await insertzoombox(req, fachseite, RaumID, pixelinnen, werkzeugeinnen, sonderwerkzeugeinnen, KoordinatenID);

            //sperren bis Fach angelegt ist
            while (mutex === 1) {
              await new Promise(resolve => setTimeout(resolve, 5));
            };
          }
        }
      }

      console.log("Erfolgreich angelegt");

      return res.status(200).send({
        "meldung": "super"
      })

    }
    else {
      console.log("Fahrzeug existiert bereits");
      throw new Error("Fahrzeug existiert bereits");
    }

  }
  catch (err) {
    console.log(err.message)

    if (err.message === "Fahrzeugname ist leer") status = 400;
    if (err.message === "Fahrzeug existiert bereits") status = 400;
    res.status(status).send({ 'meldung': err.message });

  }
});

// Functions --------------------------------------------------------------------------------------------------------------

//Existiert Fahrzeug schon?
async function existiertFahrzeug(req) {

  db.getConnection((connErr, conn) => {
    if (connErr) {
      throw connErr;
    }
    conn.beginTransaction((txErr) => {
      if (txErr) {
        throw txErr;
      }
      console.log("In Transaction existiertFahrzeug")

      conn.query(`SELECT Fahrzeugtyp FROM Feuerwehrfahrzeuge ;`, (queryErr, result) => {
        if (queryErr) {
          throw queryErr;
        }
        for (let i = 0; i < result.length; i++) {
          if (result[i].Fahrzeugtyp === req.body.type) fahrzeugvorhanden = 1;
        }

        console.log("Gebe mutex Fahrzeugüberprüfung frei");
        mutex = 0; //mutex freigeben
        conn.commit((commitErr) => {
          if (commitErr) {
            throw commitErr;
          }
          // Verbindung schließen

          conn.end();
        });
      })
    });
  });
}


//neues Fahrzeug erstellen (Fahrzeugtyp)
async function newFahrzeug(req) {
  console.log("In new Fahrzeug");
  console.log("Fahrzeug: ");
  console.log(`'${(req.body.type)}'`);

  return new Promise((resolve, reject) => {
    db.getConnection((connErr, conn) => {
      if (connErr) {
        reject(connErr);
      }
      conn.beginTransaction((txErr) => {
        if (txErr) {
          reject(txErr);
        }

        // Abfrage durchführen
        conn.query(`INSERT INTO Fahrzeugtypen (Fahrzeugtyp) VALUES ('${(req.body.type)}');`, (queryErr, rows) => {
          if (queryErr) {
            reject(queryErr);
          }
          console.log(rows);

          //Fahrzeug einfügen
          conn.query(`INSERT INTO Feuerwehrfahrzeuge (Fahrzeugtyp) VALUES ('${(req.body.type)}');`, (queryErr, rows) => {
            if (queryErr) {
              reject(queryErr);
            }


            console.log(rows);
            console.log("Fahrzeug fertig angelegt");
            // Transaktion beenden
            conn.commit((commitErr) => {
              if (commitErr) {

                reject(commitErr);

              }
              // Verbindung schließen
              console.log("Gebe mutex frei");
              mutex = 0; //mutex freigeben
              conn.end();
              resolve();
            });
          });
        });
      });
    });
  });

}


//Legt die äußeren Hitboxen an
async function Hitboxanlegen(req, fachseite, RaumID, pixelaussen) {


  console.log("in Hitbox Geräteraum anlegen");
  //Die in router.post angegebenen Klassen bilden die Middleware und werden chronologisch abgelaufen
  //1. FahrzeugID herausfinden
  //2. Eintrag der Hitbox in BeladungsID                      (Aber erst alle 4 Einträge!!!)
  //3. HitboxID der neu angelegten Hitboxen herausfinden
  //4. Hitbox mit Werten eintragen
  console.log("Die hoffentlich guten Ausgaben:");
  console.log(RaumID);
  console.log(fachseite);
  console.log("--------------------");

  //Mit dem vermutlich letzten Methodenaufruf von newEditorEntry geht er rein (an sich kein Problem, wenn er die anderen nachholt)
  return new Promise((resolve, reject) => {
    db.getConnection((connErr, conn) => {
      if (connErr) {
        reject(connErr);
      }
      conn.beginTransaction((txErr) => {
        if (txErr) {
          reject(txErr);
        }

        //FahrzeugID herausfinden
        conn.query(`Select FahrzeugID from Feuerwehrfahrzeuge where Fahrzeugtyp = '${(req.body.type)}'`, (queryErr, result1) => {
          if (queryErr) {
            reject(queryErr);
          }
          console.log(`'${(req.body.type)}'`);
          console.log("Das Fahrzeug hat die FahrzeugID:");
          console.log(result1);

          req.FahrzeugID = result1;

          //Teile Fahrzeug eine Hitbox mit einer HitbixID zu
          conn.query(`INSERT INTO BeladungsID (FahrzeugID, Fachseite) VALUES (` + req.FahrzeugID[0].FahrzeugID + `,'` + fachseite + `');`, (queryErr, result2) => {
            if (queryErr) {
              reject(queryErr);
              return;
            }
            console.log(result2);

            //Diese HitboxID herausfinden
            conn.query(`Select MAX(BeladungsID.HitboxID) as HBoxID from BeladungsID left join Torhitbox
                on BeladungsID.HitboxID = Torhitbox.HitboxID
                where Fachseite= '`+ fachseite + `' AND FahrzeugID=` + req.FahrzeugID[0].FahrzeugID + ` 
                limit 1;`, (queryErr, result3) => {
              if (queryErr) {
                reject(queryErr);
                return;
              }
              console.log(result3);
              console.log("HitboxID= " + result3[0]);
              console.log(result3);
              req.HitboxID = result3;
              let HitboxID = req.HitboxID[0].HBoxID;

              console.log("RaumID:" + RaumID)
              console.log(pixelaussen);

              let pixelaussenwert = pixelaussen[RaumID];

              console.log(pixelaussenwert);

              console.log("Pixelalle:" + pixelaussenwert);
              console.log("Pixel:" + pixelaussenwert[1]);
              console.log("HitboxID:" + req.HitboxID[0].HBoxID);

              //x,y,with und height werte der zugeteilten Hitbox speichern
              conn.query(`INSERT INTO Torhitbox (HitboxID, Pixel, Koordinate, RaumID) 
                      VALUES (`+ HitboxID + `,` + pixelaussenwert[0] + `, "x",` + RaumID + ` );`, (queryErr) => {
                if (queryErr) {
                  reject(queryErr);
                  return;
                }
                conn.query(`INSERT INTO Torhitbox (HitboxID, Pixel, Koordinate, RaumID) 
                        VALUES (`+ HitboxID + `,` + pixelaussenwert[1] + `, "y",` + RaumID + ` );`, (queryErr) => {
                  if (queryErr) {
                    reject(queryErr);
                    return;
                  }
                  conn.query(`INSERT INTO Torhitbox (HitboxID, Pixel, Koordinate, RaumID) 
                          VALUES (`+ HitboxID + `,` + pixelaussenwert[2] + `, "width",` + RaumID + ` );`, (queryErr) => {
                    if (queryErr) {
                      reject(queryErr);
                      return;
                    }
                    conn.query(`INSERT INTO Torhitbox (HitboxID, Pixel, Koordinate, RaumID) 
                            VALUES (`+ HitboxID + `,` + pixelaussenwert[3] + `, "height",` + RaumID + ` );`, (queryErr) => {
                      if (queryErr) {
                        reject(queryErr);
                        return;
                      }
                      console.log("Einen Geräteraum angelegt");
                      // Transaktion beenden
                      conn.commit((commitErr) => {
                        if (commitErr) {
                          reject(commitErr);
                          return;
                        }
                        console.log("Gebe mutex frei");
                        mutex = 0;
                        // Verbindung schließen
                        conn.end();
                        resolve();
                      });
                      //  });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}


//Hitboxen für die Fächer -----------------------------------------------------------------------------------------------

async function insertzoombox(req, fachseite, RaumID, pixelinnen, werkzeugeinnen, sonderwerkzeugeinnen, KoordinatenID) {
  //0. FahrzeugID herausfinden                                                
  //1. Geräteraumhitbox Identifizieren (FahrzeugID, seite, RaumID)                      
  //2. In HitboxID Fächer anlegen (Benötige dafür HitbxID)                                           
  //3. letzte FachID von HitboxID selecten (zugehörig zum aktuellen Fahrzeug)                                    
  //4. In Fachliste eintragen (FachID,PixelFach,Koordinate,KoordinatenID)     

  return new Promise((resolve, reject) => {
    db.getConnection((connErr, conn) => {
      if (connErr) {
        reject(connErr);
        return;
      }
      conn.beginTransaction((txErr) => {
        if (txErr) {
          reject(txErr);
          return;
        }
        console.log("Lege Zoombox an");
        // Abfrage durchführen

        //FahrzeugID herausfinden
        conn.query(`Select FahrzeugID from Feuerwehrfahrzeuge where Fahrzeugtyp = '${(req.body.type)}'`, (queryErr, result0) => {
          if (queryErr) {
            reject(queryErr);
            return;
          }
          req.FahrzeugID = result0;

          //HitboxID herausfinden in den die Zoomboxen gespeichert werden
          conn.query(
            `Select BeladungsID.HitboxID as HBoxID from BeladungsID left join Torhitbox
            on BeladungsID.HitboxID = Torhitbox.HitboxID
            where Fachseite= '`+ fachseite + `' AND RaumID = ` + RaumID + ` AND FahrzeugID=` + req.FahrzeugID[0].FahrzeugID + ` limit 1;`, (queryErr, result1) => {
            if (queryErr) {
              reject(queryErr);
              return;
            }
            console.log("HitboxID: " + result1);

            let HitboxIDFach = result1;

            //Hitbox einer Zoombox hinzufügen mit FachID (einzigartige ID einer Zoombox)
            conn.query(`INSERT INTO HitboxID (HitboxID) VALUES (` + HitboxIDFach[0].HBoxID + `);`, (queryErr, result2) => {
              if (queryErr) {
                reject(queryErr);
                return;
              }

              //FachID herausfinden
              conn.query(`Select MAX(FachID) as MaxIDFach from HitboxID inner join BeladungsID 
              on HitboxID.HitboxID = BeladungsID.HitboxID 
              left join Torhitbox on BeladungsID.HitboxID = Torhitbox.HitboxID
              where FahrzeugID =`+ req.FahrzeugID[0].FahrzeugID + `
              AND Fachseite = '`+ fachseite + `'
              AND BeladungsID.HitboxID = `+ HitboxIDFach[0].HBoxID + `
              AND Torhitbox.RaumID = `+ RaumID + ` ;`, (queryErr, result3) => {
                if (queryErr) {
                  reject(queryErr);
                  return;
                }
                req.FachID = result3;
                let FachID = req.FachID[0].MaxIDFach;

                //Fach erstellen
                insertFachliste(req, pixelinnen, FachID, KoordinatenID);
                console.log("Fach innen Eingefügt!!!!!!!!!!!!!!!!!!");

                insertWerkzeug(req, FachID, KoordinatenID, werkzeugeinnen);
                insertsonderwerkzeug(req, FachID, KoordinatenID, sonderwerkzeugeinnen)

                // Transaktion beenden
                conn.commit((commitErr) => {
                  if (commitErr) {
                    reject(commitErr);
                    return;
                  }
                  console.log("mutex freigebn");
                  mutex = 0;
                  // Verbindung schließen
                  conn.end();
                  resolve();
                });
              });
            });
          });
        });
      });
    });
  });
}

//Legt die finalen Zoomboxen an, nachdem in der Transaction die ganzen verlinkungen und Verweise gesetzt wurden
async function insertFachliste(req, pixelinnen, FachID, KoordinatenID) {
  console.log("In insertFachliste-----------------------------------------------------");
  const koordinate = ["x", "y", "width", "height"];
  for (let i = 0; i < 4; i++) {
    console.log("Koordinate: " + koordinate[i]);
    db.query(`Insert Into Fachliste (FachID,PixelFach,Koordinate,KoordinatenID) Values (` + FachID + `,` + pixelinnen[i] + `,'` + koordinate[i] + `',` + KoordinatenID + `);`,
      (err, result) => {
        if (err) { throw err; }
      });
  }
  console.log("Zoombox angelegt");
}

//Teilt den Fächern Werkzeuge zu
async function insertWerkzeug(req, FachID, KoordinatenID, werkzeugeinnen) {
  console.log("In insertWerkzeuge")
  if (typeof werkzeugeinnen === "undefined") console.log("werkzeug ist undefined")
  console.log("werkzeuge: ");

  for (let i = 0; typeof werkzeugeinnen !== "undefined" && i < werkzeugeinnen.length; i++) {
    let werkzeug = werkzeugeinnen[i];
    console.log(werkzeug);

     new Promise((resolve, reject) => {
      db.getConnection((connErr, conn) => {
        if (connErr) {
          reject(connErr);
          return;
        }
        conn.beginTransaction((txErr) => {
          if (txErr) {
            reject(txErr);
            return;
          }
          conn.query(`Select StandardID from Standardgeraetschaft 
              where Geraetebezeichnung = "`+ werkzeug + `";`, (queryErr, result0) => {
            if (queryErr) {
              reject(queryErr);
              return;
            }

            req.werkzeugid = result0;
            console.log("werkzeugid: ");
            console.log(req.werkzeugid);
            console.log(req.werkzeugid.StandardID);


            if (req.werkzeugid.length > 0) {
              werkzeuganlegen(FachID, req.werkzeugid, KoordinatenID);
            }
              conn.commit((commitErr) => {
                if (commitErr) {
                  reject(commitErr);
                  return;
                }
                // Verbindung schließen
                conn.end();
                resolve();
              });
          });
        });
      });
    });
  }//end of 


}//end of function

function werkzeuganlegen(FachID, werkzeugid, KoordinatenID) {

  db.query(`Insert Into Fachliste (FachID,StandardID,KoordinatenID) Values (` + FachID + `,'` + werkzeugid[0].StandardID + `',` + KoordinatenID + `);`, (queryErr, result1) => {
    if (queryErr) {
      reject(queryErr);
      return;
    }
  });

}

async function insertsonderwerkzeug(req, FachID, KoordinatenID, sonderwerkzeugeinnen) {
  console.log("Wir haben Sonderwerkzeuge!")

  for (let i = 0; typeof sonderwerkzeugeinnen !== "undefined" && i < sonderwerkzeugeinnen.length; i++) {
    let sonderwerkzeug = sonderwerkzeugeinnen[i];
    console.log(sonderwerkzeug);

     new Promise((resolve, reject) => {
      db.getConnection((connErr, conn) => {
        if (connErr) {
          reject(connErr);
          return;
        }
        conn.beginTransaction((txErr) => {
          if (txErr) {
            reject(txErr);
            return;
          }

          //Überprüfen ob Sonderwerkzeug (noch) Elemente hat
          console.log("Wir haben Sonderwerkzeuge!")

          //wenn Sondersonderwerkzeug Elemente hat, Sonderwerkzeug anlegen
          conn.query(`INSERT INTO Sonderbeladung(Geraetebezeichnung) values("` + sonderwerkzeug + `");`, (queryErr, result) => {
            if (queryErr) {
              reject(queryErr);
              return;
            }
          


          //ID des Sonderwerkzeuges holden
          conn.query('SELECT SonderID from Sonderbeladung where Geraetebezeichnung ="' + sonderwerkzeug + '";', (queryErr, result0) => {
            if (queryErr) {
              reject(queryErr);
              return;
            }

            let sonderwerkzeugid = result0;
            if (sonderwerkzeugid.length > 0) {
            sonderwerkzeuganlegen(FachID, sonderwerkzeugid, KoordinatenID);
            }

            conn.commit((commitErr) => {
              if (commitErr) {
                reject(commitErr);
                return;
              }
              // Verbindung schließen
              conn.end();
              resolve();
            });
          }
          );
        });
        });
      });
    });
  }//end of for        
}

function sonderwerkzeuganlegen(FachID, sonderwerkzeugid, KoordinatenID) {
            //ID in das Fach ablegen
            console.log(sonderwerkzeugid[0])
            console.log(sonderwerkzeugid[0].SonderID)
            
              console.log("Sonderwerkzeug nicht undefinded!!!");
              db.query('INSERT INTO Fachliste(FachID, SonderID, KoordinatenID) VALUES(' + FachID + `,'` + sonderwerkzeugid[0].SonderID + `',` + KoordinatenID + `);`, (queryErr, result1) => {
                if (queryErr) {
                  throw queryErr;
                }
              }
              );
            
}


//EDITOR Fahrzeug Methoden Ende -------------------------------------------------------------------------------------------------

router.post('/deleteFahrzeug', function (req, res) {
  console.log("In deleteFahrzeug");
  console.log("Das zu löschende Fahrzeug: " + `'${(req.body.type)}'`);

  db.getConnection((connErr, conn) => {
    if (connErr) {
      reject(connErr);
      return;
    }
    conn.beginTransaction((txErr) => {
      if (txErr) {
        reject(txErr);
        return;
      }
      conn.query(`SET FOREIGN_KEY_CHECKS=0;`, (queryErr, result0) => {
        if (queryErr) {
          throw queryErr;
        }
        conn.query(`Delete from Fahrzeugtypen where Fahrzeugtyp = '${(req.body.type)}';`, (queryErr, result0) => {
          if (queryErr) {
            throw queryErr;
          }
          conn.query(`Delete from Feuerwehrfahrzeuge  where Fahrzeugtyp = '${(req.body.type)}'`, (queryErr, result0) => {
            if (queryErr) {
              throw queryErr;
            }
            conn.query(`SET FOREIGN_KEY_CHECKS=1;`, (queryErr, result0) => {
              if (queryErr) {
                throw queryErr;
              }

              conn.commit((commitErr) => {
                if (commitErr) {
                  throw commitErr;
                }
                // Verbindung schließen

                conn.end();
              });
            });
          });
        });
      });
    });
  });
  ordnerlöschen(req);
  res.status(200).send({ "meldung": "Erfolgreich gelöscht" })
})

//Löscht die erstellte Ordnerstruktu eines Fahrzeuges
async function ordnerlöschen(req) {

  return new Promise((resolve, reject) => {

    deleteFolderRecursive('./src/' + req.body.type + '/links', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    fs.rmdir('./src/' + req.body.type + '/links', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    deleteFolderRecursive('./src/' + req.body.type + '/rechts', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
    fs.rmdir('./src/' + req.body.type + '/rechts', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    deleteFolderRecursive('./src/' + req.body.type + '/hinten', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
    fs.rmdir('./src/' + req.body.type + '/hinten', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    deleteFolderRecursive('./src/' + req.body.type + '/oben', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
    fs.rmdir('./src/' + req.body.type + '/oben', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    deleteFolderRecursive('./src/' + req.body.type, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
    fs.rmdir('./src/' + req.body.type, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    fs.unlink('./src/autoliste/' + req.body.type + '.jpg', (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    resolve();
  });
}


//Löscht den Inhalt des angegebenen Ordner Pfades
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


module.exports = router;