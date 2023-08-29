<!-- Author: Emanuel Bisso -->
<template>
  <div>
    <div v-if="error" style="backgroundColor: red;">
      Es ist ein Fehler aufgetreten
    </div>
    <p style="text-align: center;">
          Welches Werkzeug liegt in dem markierten Fach? <br><span style="font-weight: bold;"></span>
    </p>
    <div>
      <TheQuizControl :fahrzeugname="fahrzeugname" @values="values" :zeigeKorrekteAntwort="zeigeKorrekteAntwort" :korrektesTor="korrektesTor" :korrektesFach="korrektesFach" :korrekteSeite="korrekteSeite"/>
    </div>

    <!-- HTML for QuizName -->
    <div>
      <b-button-group vertical style="width: 100%" >
        <b-button v-for="(k, index3) in toolSelection" :key="index3" :id=toolSelection[index3] :pressed.sync="toolSelectionState[index3]" class="toolButtons" @click="updateUserAnswer" style="border-radius: 4px; margin: 1px;">{{toolSelection[index3]}}</b-button>
      </b-button-group>
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
        <b-col class="text-end">
          <b-button v-if="(answer === 'richtig' || tries === 0)" @click="startQuizName">Nächte Frage &#707;&#707;</b-button>
          <b-button v-else @click="sendAnswer">Antwort senden</b-button>
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
        quizScore: 0,         //Hier wird der User-Punktestand gespeichert
        tries: 0,
        answer: "",           //Hier wird gespeichert, ob die Antwort des Nutzers richtig oder falsch war

        //wird dieser Wert auf true gesetzt, werden die anderen Komponenten benachrichtigt, die richtige Antwort zu zeigen
        zeigeKorrekteAntwort: false,

        //Das vom Backend zufällig ausgewählte Fach wird in den drei Variablen 'korrektesTor', 'korrekteSeite' und 'korrektes Fach' gespeichert
        korrektesTor: null,
        korrektesFach: 0,
        korrekteSeite: 0,

        //In der Variable 'toolSelection' werden die Auswahlmöglichkeiten des Quizes gespeichert, damit sie gerendert werden können
        toolSelection: [],
        toolSelectionState: [false, false, false, false, false],
      
        pickedTool: "",       //Vom Benutzer ausgewähltes Werkzeug

        ausgewähltesTor: "",  
        ausgewähltesFach: "",
        ausgewählteSeite: "",

        error: false,
      }
    },
    props: { // Übergebener Wert der Eltern-Komponente
      fahrzeugname: String,
    },
    components: {
    TheQuizControl
},
    methods: { // Methoden die in der gesamten Komponente erreichbar sind 
    values: function (KoordinatenID, Fachseite, RaumID){
        this.sendAnswer(KoordinatenID, Fachseite, RaumID);
    },
     //Starte das Locate-Quiz --> Benutzer muss das richtige Fach finden, worin sich das Werkzeug befindet, was angezeigt wird
    startQuizName: async function() {
      //Sende eine Get-Request an das Backend, welches aus der Datenbank ein zufälliges Fach auswählt und zurück ans Frontend sendet
      //Setze Anzahl der Versuche und andere Werte des Quizs zurück
      this.tries = 1;
      //Zuklappen des Next-Buttons
      this.zoomBox = [];
      this.hitBox = [];
      this.toolSelection = [];
      this.toolSelectionState = [false, false, false, false, false];
      this.zeigeKorrekteAntwort = false;
      this.answer = "";
      let response_compartment = [];                        // random compartment
      let response_tools = [];                              // bestandsliste des random compartments
      
      let Fachseite = "";
      let RaumID = "";
      let KoordinatenID = "";


      while (response_tools.length == 0) {
        response_compartment = await this.makeRequest (
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getrandomfach?Fahrzeugtyp=${this.fahrzeugname}`,
        null
        );
        response_compartment = JSON.parse(response_compartment).result;
        Fachseite = (response_compartment[0].Fachseite);
        RaumID = (response_compartment[0].RaumID);
        KoordinatenID = (response_compartment[0].KoordinatenID);

        response_tools = await this.makeRequest (
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getbestandsliste?Fahrzeugtyp=${this.fahrzeugname}&Fachseite=${Fachseite}&RaumID=${RaumID}&KoordinatenID=${KoordinatenID}`,
        null
        );
        response_tools = JSON.parse(response_tools).result;
      }

      this.ausgewählteSeite = Fachseite;
      this.ausgewähltesTor = RaumID;
      this.ausgewähltesFach = KoordinatenID;
      

      setTimeout( () => this.colorCompartment(this.ausgewähltesFach, this.ausgewählteSeite, this.ausgewähltesTor), 1000);

      // Auswahl an Werkzeugen vom Backend anfragen, um sie als Antwortmöglichkeiten Anzeigen zu lassen
      // --> enthält ein richtiges Werkzeug, welches sich in dem abgefragten Fach befindet, und 4 weitere falsche Werkzeuge
      let response = await this.makeRequest (
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getauswahlmoeglichkeit?Fahrzeugtyp=${this.fahrzeugname}&Fachseite=${this.ausgewählteSeite}&RaumID=${this.ausgewähltesTor}&KoordinatenID=${this.ausgewähltesFach}`,
        null        
      );
      response = JSON.parse(response).result;
      for (let i = 0; i < 5; i++){
        if (typeof response[i] != 'undefined') {
          let currentTool = response[i].Standardgeraet;
          this.toolSelection.push(currentTool);
        }
      }
    },


    updateUserAnswer: function(e) {       //Button-Highlighting
      this.pickedTool = e.target.id;
      let index = this.toolSelection.indexOf(this.pickedTool);
      for (let i = 0; i < this.toolSelectionState.length; i++) {
        this.toolSelectionState[i] = false;
      }
      this.toolSelectionState[index] = true;
    },


    sendAnswer: async function() {
      //Wenn bereits die richige Antwort gegeben wurde, wird die Funktion verlassen
      //Wenn der Benutzer keine Versuche mehr übrig hat, soll nicht mehr überprüft werden
      //Wenn die Animation noch läuft, darf der Nutzer keine Antworten senden
      if ((this.answer === 'richtig')
          || (this.tries === 0)
          || (this.animation)) {
        return;
      }
      let tool = this.pickedTool;     //Werkzeug, das vom User ausgewählt wurde
      let correctTool = '';
      let response = await this.makeRequest (
        "GET",
        `https://elwing.cs.hs-rm.de:3000/getantwort2?Fahrzeugtyp=${this.fahrzeugname}&Fachseite=${this.ausgewählteSeite}&RaumID=${this.ausgewähltesTor}&KoordinatenID=${this.ausgewähltesFach}`,
        null
      );
      response = JSON.parse(response).result;
      if (typeof response[0] == 'undefined') {
        this.error = true;
      }
      //überprüfen, ob vom User ausgewähltes Werkzeug richtig ist answer entsprechend setzen
      //Korrektes Tool in correctTool legen und später grün markieren
      for (let i = 0; i < 10; i++) {
        if (typeof response[i] == 'undefined') { continue; }
        let currentTool = response[i].Standardgeraet;
        if (this.toolSelection.includes(currentTool)) { correctTool = currentTool; }
      }
      this.answer = (tool === correctTool ? 'richtig' : 'falsch');


      if (this.answer === 'richtig') {
        //Während die Animation läuft und der Wert auf true liegt, dürfen keine weitere Fächer angeklickt werden
        this.animation = true;
        setTimeout(() => this.animation = false, 1000);
        document.querySelector(`#${CSS.escape(correctTool)}`).style.backgroundColor = "rgba(3, 117, 18, 1)";
        this.quizScore++;
      }
      else if (this.answer === 'falsch' && this.tries > 0) {
        this.animation = true;
        setTimeout(() => this.answer = 'null', 1000);
        setTimeout(() => this.animation = false, 1000);
        document.querySelector(`#${CSS.escape(tool)}`).style.backgroundColor = "rgba(152, 6, 6, 1)";
        document.querySelector(`#${CSS.escape(correctTool)}`).style.backgroundColor = "rgba(3, 117, 18, 1)";
        
        this.tries--; 
      }
      if (this.tries === 0 && this.answer === 'falsch') {
        this.answer = 'falsch';
        return;
      }
    },


    colorCompartment: function(KoordinatenID, Fachseite, RaumID) {
      //Fall für oben
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
    this.startQuizName();
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

.toolButtons :active {
  border: 20px solid black;
}

.shake {      /*Animation für das "FALSCH"-Banner*/ 
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