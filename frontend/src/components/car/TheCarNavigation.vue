<!-- Author: Jan-Christopher Möhn -->
<!-- Erste Verison mit Emanuel Bisso erstellt-->
<!-------- HTML -------->
<template>
  <div class="frame">
    <b-modal id="modal1" title="Auto1" size="xl" hide-header hide-footer>
      <!-- Header -->
      <b-row class="header">
        <b-col class="fahrzeugname">
          <h4>{{fahrzeugname}}</h4>
        </b-col>
        <b-col class="buttonPopover">
          <TheHelpCar :fahrzeugname="fahrzeugname"/>
          <b-button class="closeButton" @click="$bvModal.hide('modal1')">X</b-button>
        </b-col>
      </b-row>
      <!-- Body -->
      <div class="anzeige">
        <!-- Bild anzeigen -->
        <TheCarView :imgCount="imgCount" :visibleImg="visibleImg" :fahrzeugname="fahrzeugname" :topShow="topShow" @visibleImage="visibleImage"/>
        <!-- Nach oben gehen -->
        <b-button class="top" v-if="this.imgCount%3==1 && !this.topShow" @click="top()">
          <div class="upSymbol">
            &#10094;
          </div>
        </b-button>
        <!-- Nach unten gehen -->
        <b-button class="down" v-if="this.topShow" @click="down()">
          <div class="downSymbol">
            &#10095;
          </div>
        </b-button>
        <!-- Nach rechts gehen -->
        <b-button class="prev" @click="prev()" v-if="!this.topShow">
          &#10094;
        </b-button>
        <!-- Nach links gehen -->
        <b-button class="next" @click="next()" v-if="!this.topShow">
          &#10095;
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
import TheHelpCar from '@/components/car/TheHelpCar.vue'
import TheCarView from '@/components/car/TheCarView.vue'
export default {
  props: { // Übergebener Wert der Eltern-Komponente
    fahrzeugname: String,
  },
  components: { // Eingebundene Kinder-Komponenten
    TheCarView,
    TheHelpCar,
  },
  data() { // Datenobjekte die in der gesamten Komponente erreichbar sind
    return {
      imgCount: 999, // Welche Seite wird angezeigt
      topShow: false, // Wird die obere Seite angezeigt
      visibleImg: false, // Wird eine Seite oder ein offenes Tor angezeigt
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
    visibleImage(visible) { // VisibleImg-Variable updaten
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