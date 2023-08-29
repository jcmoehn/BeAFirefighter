<!-- Author: Emanuel Bisso -->
<template>
    <div>
        <p style="text-align: center;">
            In welchem Fach liegt folgender Gegenstand? <br><span style="font-weight: bold;">{{(this.randomTool)}}</span>
        </p>
        <div>
            <TheQuizControl :fahrzeugname="fahrzeugname" @values="values" :zeigeKorrekteAntwort="zeigeKorrekteAntwort" :korrektesTor="korrektesTor" :korrektesFach="korrektesFach" :korrekteSeite="korrekteSeite"/>
        </div>
        <div id="score" style="position:relative;">
            <b-row>
              <!-- Jenachdem, ob die Antwort des Nutzers richtig ist, wird einer der Paragraphen angezeigt -->
              <b-col>
                <div>
                  <p v-if="(answer==='richtig')" :style="{backgroundColor: 'rgb(133, 232, 90)'}" style="text-align:center; padding-top:2%; padding-bottom:2%; font-weight: bold; font-size:large;">
                    RICHTIG
                  </p>
                  <p v-if="(answer==='falsch')" :style="{backgroundColor: 'rgb(255, 50, 40)'}" style="text-align:center; padding-top:2%; padding-bottom:2%; font-weight: bold; font-size:large;" :class="{ shake: animation }">
                    FALSCH
                  </p>
              </div>
              </b-col>
            </b-row>
            <b-row>
              <!-- Wenn die Antwort richtig ist, oder der Nutzer keine Versuche mehr hat, kann man zur nächsten Frage springen -->
              <b-col v-if="(answer === 'richtig' || tries === 0)" class="text-end">
                <b-button @click="startQuizLocate">Nächte Frage &#707;&#707;</b-button>
              </b-col>
            </b-row>
            <b-row>
              <!-- Hier werden Punktezahl und verbleibende Versuche angezeigt -->
              <b-col style="text-align:left;">Dein Score: <span style="font-weight: bold;">{{this.quizScore}}</span></b-col>
              <b-col style="text-align:right;">Deine Versuche: <span style="font-weight: bold;">{{this.tries}}</span></b-col>
            </b-row>
          </div>
    </div>
</template>
    
<script>
    import TheQuizControl from '@/components/quiz/TheQuizControl.vue';
    export default {
    data (){ // Datenobjekte die in der gesamten Komponente erreichbar sind
      return {
        randomTool: "",       //In dieser Variable wird das vom Backend geschickte zufällige Werkzeug gespeichert, welches abgefragt wird
        quizScore: 0,         //Hier wird der User-Punktestand gespeichert
        answer: "",           //Hier wird gespeichert, ob die Antwort des Nutzers richtig oder falsch war


        //wird dieser Wert auf true gesetzt, werden die anderen Komponenten benachrichtigt, die richtige Antwort zu zeigen
        zeigeKorrekteAntwort: false,

        //Diese Werte werden beim Anzeigen des richtigen Fachs an die anderen 
        //Komponenten gesendet, damit sich die Fahrzeugansicht so ändert, 
        //dass das richtige Werkzeug angezeigt wird
        korrektesTor: null,
        korrektesFach: 0,
        korrekteSeite: 0,
      }
    },
    props: { // Übergebener Wert der Eltern-Komponente
      fahrzeugname: String,
    },
    components: { // Eingebundene Kinder-Komponenten
      TheQuizControl,
    },
    methods: { // Methoden die in der gesamten Komponente erreichbar sind 
    values: function (KoordinatenID, Fachseite, RaumID){
        this.sendAnswer(KoordinatenID, Fachseite, RaumID);
    },
     //Starte das Locate-Quiz --> Benutzer muss das richtige Fach finden, worin sich das Werkzeug befindet, was angezeigt wird
    startQuizLocate: async function() {
      //Sende eine Get-Request an das Backend, welches aus der Datenbank ein zufälliges Werkzeug auswählt und zurück ans Frontend sendet
      //Setze Anzahl der Versuche zurück und andere Werte des Quizs zurück
      this.tries = 3;
      //Zuklappen des Next-Buttons
      this.answer = null;
      this.showAnswer = false;
      this.zeigeKorrekteAntwort = false;
      this.korrekteSeite = null;
      this.korrektesTor = null;
      this.korrektesFach = null;
      
      //Zufälliges Werkzeug aus dem Backend zuschicken lassen
      let response = await this.makeRequest (
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getzufaelligeswerkzeug?Fahrzeugtyp=${this.fahrzeugname}`,
        null
      );
      response = JSON.parse(response).result;
      //Dieses Werkzeug wird im Quiz angezeigt und abgefragt
      let tool = "";
      console.log(response);
      if (response[0].Standardgeraet == null) {
        console.log("Standardgerät ist undefined");
        tool = response[0].Sondergeraet;
      }
      else if (response[0].Sondergeraet == null) {
        console.log("Sondergeraet ist undefined");
        tool = response[0].Standardgeraet;
      }

      else if (response[0].Standardgeraet != null && response[0].Sondergeraet != null) {
        console.log("Beides vorhanden");
        tool = (Math.random() < 0.5 ? response[0].Standardgeraet : response[0].Sondergeraet);
      }
      console.log(tool)
      this.randomTool = tool;
    },


    sendAnswer: function(KoordinatenID, Fachseite, RaumID) {
      //wird nur ausgelöst, wenn der richtige Modus ausgewählt ist
      //Wenn bereits die richige Antwort gegeben wurde, wird die Funktion verlassen
      //Wenn der Benutzer keine Versuche mehr übrig hat, soll nicht mehr überprüft werden
      if ((this.answer === 'richtig')
          || (this.tries === 0)
          || (this.animation)) {
        return;
      }
      //Nachdem der Benutzer auf eine Hitbox klickt, wird diese Funktion ausgelöst
      //Die ID der angeklickten Hitbox wird an das Backend geschickt und es wird überprüft, ob die Antwort richtig ist
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.open(
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getantwort?Fahrzeugtyp=${this.fahrzeugname}&Fachseite=${Fachseite}&RaumID=${RaumID}&KoordinatenID=${KoordinatenID}&Werkzeug=${this.randomTool}`,
        false
      );
      xmlHttp.send( null );
      //Richtig oder Falsch String als Antwort
      let response = JSON.parse(xmlHttp.responseText).antwort;
      this.answer = response;
      this.checkAnswer();
      
    },

    checkAnswer: function() {
      if (this.answer === 'richtig') {
        //Während die Animation läuft und der Wert auf true liegt, dürfen keine weitere Fächer angeklickt werden
        this.animation = true;
        setTimeout(() => this.animation = false, 1000);
        this.quizScore++;
      }
      else if (this.answer === 'falsch' && this.tries > 0) {
        this.animation = true;
        setTimeout(() => this.answer = 'null', 1000);
        setTimeout(() => this.animation = false, 1000);
        this.tries--;
        
      }
      if (this.tries === 0 && this.answer === 'falsch') {
        this.showCorrectAnswer();
        return;
      }
      

    },
    showCorrectAnswer: function() {       // Funktion, um die Informationen über das grün zu markierende Fach zu setzen
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.open(
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getkorrekteantwort?Fahrzeugtyp=${this.fahrzeugname}&Werkzeug=${this.randomTool}`,
        false
      );
      xmlHttp.send( null );
      let response = JSON.parse(xmlHttp.responseText).result;
      let KID = response[0].KoordinatenID;
      let FS = response[0].Fachseite;
      let RID = response[0].RaumID;
      /* eslint-disable */
      //Anzeigen der richtigen Seite
      setTimeout(() => this.colorCompartment(KID, FS, RID), 1000);
    },

    colorCompartment: function(KoordinatenID, Fachseite, RaumID) {
      this.zeigeKorrekteAntwort = true;
      this.korrektesTor = RaumID;
      this.korrektesFach = KoordinatenID;
      this.korrekteSeite = this.getSide(Fachseite);
      setTimeout(() => this.showAnswer = true, 1000);
    },

    getSide: function(side) {
      switch (side) {
        case 'links':
          return 0;
        case 'hinten':
          return 1;
        case 'rechts':
          return 2;
        case 'oben':
          return 3;
      }
    },

    makeRequest ( method, url, data ) { // Funktion um einen request zu senden
      return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve (xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        xhr.send(data);
      });
    },
  },
  created(){ // Wenn die komponente ertsllt wird, werden alle Seiten-Bilder geladen
    this.startQuizLocate();
  },

}
</script>


<style scoped>
.frame { /* Außen Rahmen */
  position: relative;
}
.darkImg { /* Verdunkeltes Bild */
  width: 100%;
  height: auto;
  filter: brightness(50%);
}
.img { /* Normales Bild */
  width: 100%;
  height: auto;
}
.hitBoxen { /* Hitboxen */
  position: absolute;
  background-color: rgba(255,255,255,0.5);
  border: 1px solid black;
}
.zoomBild { /* Zoom-Bild */
  position: absolute;
}
.zoomBoxen { /* Zoomboxen */
  position: absolute;
  background-color: rgba(255,255,255,0.5);
  border: 1px solid black;
}
#collapse { /* In den Hintergrund clicken */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  cursor:default;
  z-index: 0;
  background: transparent;
}
.shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
  }
  
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-2px, 0, 0);
    }
  
    20%,
    80% {
      transform: translate3d(4px, 0, 0);
    }
  
    30%,
    50%,
    70% {
      transform: translate3d(-8px, 0, 0);
    }
  
    40%,
    60% {
      transform: translate3d(8px, 0, 0);
    }
  }
</style>