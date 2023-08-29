
//Autoren: Fabian
const mysql = require("mariadb/callback");

var conn = mysql.createPool({
    host: "elwing.local.cs.hs-rm.de",
    port: '/var/run/mysqld/mysqld.sock',        //Adapter für UNIX - TCP Socket
    database: "BetaBrand_backup2",
    user: "BB",
    password: "Beafirefighter"
  });


module.exports = conn; 

