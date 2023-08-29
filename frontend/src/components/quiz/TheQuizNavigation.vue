<!-- Author: Emanuel Bisso mit Hilfe von Jan-Christopher Möhn -->
<template>
    <!-- Kopfzeile -->
    <div class="frame">
        <b-modal id="modal1" title="Auto1" size="xl" hide-header hide-footer>
          <b-row class="header">
            <b-col class="fahrzeugname">
              <h4>{{fahrzeugname}}</h4>
            </b-col>
            <b-col class="buttonPopover">
              <TheHelpQuiz :fahrzeugname="fahrzeugname"/>
              <b-button class="closeButton" @click="$bvModal.hide('modal1')">X</b-button>
            </b-col>
          </b-row>
        <b-row style="width:100%" class="text-center">
            <b-col cols="12">
                <toggle-switch id="toggle" style="width: 100%;" :options="myOptions" v-model="quiz_option"/>
            </b-col> 
        </b-row>
          <!-- Body -->
          <TheQuizLocate v-if="quiz_option == 'quiz_locate'" :fahrzeugname="fahrzeugname"/>
          <TheQuizName v-if="quiz_option == 'quiz_name'" :fahrzeugname="fahrzeugname"/>
          <div v-if="quiz_option == 'quiz_off'">
            <div class="m-5 p-5"></div>
            <h1 class="display-5 text-center m-2">Wähle eine Quizart aus!</h1>
            <div class="m-5 p-5"></div>
          </div>
      </b-modal>
    </div>
  </template>


<script>
import TheHelpQuiz from '@/components/quiz/TheHelpQuiz.vue'
import TheQuizLocate from '@/components/quiz/locatequiz/TheQuizLocate.vue'
import TheQuizName from '@/components/quiz/namequiz/TheQuizName.vue'

export default {
  props: { // Übergebener Wert der Eltern-Komponente
    fahrzeugname: String,
  },
  components: { // Eingebundene Kinder-Komponenten
    TheHelpQuiz,
    TheQuizLocate,
    TheQuizName
  },
  data() { // Datenobjekte die in der gesamten Komponente erreichbar sind
    return {
      imgCount: 999, // Welche Seite wird angezeigt
      topShow: false, // Wird die obere Seite angezeigt
      visibleImg: false, // Wird eine Seite oder ein offenes Tor angezeigt

      
      myOptions: {    //Optionen für den Toggle-Switch des Quizzes
        layout: {
          color: 'black',
          backgroundColor: 'lightgray',
          selectedColor: 'white',
          selectedBackgroundColor: 'green',
          borderColor: 'black',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fontWeightSelected: 'bold',
          squareCorners: false,
          noBorder: false
        },
        size: {
          fontSize: 1,
          height: 1.5,
          padding: 0,
          width: 8
        },
        config: {
          delay: .2,
          preSelected: null,
          disabled: false,
          items: [
              { name: 'Locate', value: 'quiz_locate', color: 'white', backgroundColor: 'green' },
              { name: 'Name', value: 'quiz_name', color: 'white', backgroundColor: 'green' },
          ]
        },
      },

      quiz_option: 'quiz_off',  //Hier wird die aktive ausgewählte Quiz-Option gespeichert



    }
  },
  methods: { // Methoden die in der gesamten Komponente erreichbar sind
    next: function() { // Funktion um eins nach links zu gehen
      this.visibleImg = false;
      this.imgCount += 1;
    },
    prev: function() { // Funktion um eins nach rechts zu gehen
      this.visibleImg = false;
      this.imgCount -= 1;
    },
    top: function() { // Funktion um nach oben zu gehen
      this.visibleImg = false;
      this.topShow = !this.topShow;
      this.imgCount = 3;
    },
    down: function() { // Funktion um nach unten zu gehen
      this.visibleImg = false;
      this.topShow = !this.topShow;
      this.imgCount = 1000;
    },
    visibleImage(visible) { // VisibleImg veriable updaten
      this.visibleImg = visible;
    },


    
  },
};
</script>


<!-------- CSS -------->
<style scoped>
.frame { /* Außen Rahmen */
  margin: 0;
  padding: 0;
}
.prev, .next { /* Die beiden Caroussel-Button */
  position:absolute;
  top: 0%;
  width: 4%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-width: 0.01em;
  cursor: pointer;
  color: white;
}
.prev { /* Der Caroussel-Vorwärts-Button */
  left: 0%; 
}
.next { /* Der Caroussel-Rückwärts-Button */
  left: 96%; 
}
.closeButton { /* Der Close- und Hilfe-Button */
  background-color: rgba(0,0,0,0);
  color: black;
  border: none;
}
.closeButton:hover {
  color: white;
}
.top { /* Der Caroussel-Hoch-Button */
  position:absolute;
  left: 4%; 
  top: 0%;
  width: 92%;
  height: 8%;
  background-color: rgba(0, 0, 0, 0.4);
  border-width: 0.01em;
  cursor: pointer;
  color: white;
}
.upSymbol { /* Pfeil nach oben */
  transform: rotate(90deg);
  position: absolute;
  left: 50%;
}
.down { /* Der Caroussel-Runter-Button */
  position:absolute;
  left: 0%; 
  top: 92%;
  width: 100%;
  height: 8%;
  background-color: rgba(0, 0, 0, 0.4);
  border-width: 0.01em;
  cursor: pointer;
  color: white;
}
.downSymbol { /* Pfeil nach unten */
  transform: rotate(90deg);
  position: absolute;
  left: 50%;
}
.header { /* Kopfzeile vom Popover */
  margin-bottom: 1%;
}
.fahrzeugname { /* Style für den Fahrzeugname */
  text-align: left;
}
.buttonPopover { /* Hilf- und Close-Button */
  text-align: right;
}
.anzeige { /* Bodyanzeige */
  position: relative
}
</style>