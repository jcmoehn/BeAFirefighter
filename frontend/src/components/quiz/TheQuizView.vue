<!-- Author: Emanuel Bisso mit Hilfe von Jan-Christopher Möhn -->
<template>
    <div>
        <div class="frame">
            <!-- Bild verdunkelt -->
            <div v-if="visibleImage">
              <img :src=currentImg class="darkImg"/>
              <b-button id="collapse" @click="visibleImage = false; $emit('visibleImage', visibleImage);"></b-button> 
            </div>
            <!-- Bild normal -->
            <div v-else>
              <img :src=currentImg class="img"/>
            </div>
            <!-- Hitboxen -->
            <div v-for="(i, index1) in hitBox" :key="index1">
              <button 
                :id=i[0]
                :style="{ left: i[1]+'%', top: i[2]+'%', width: i[3]+'%', height: i[4]+'%'}"
                @click="clickBox"
                class="hitBoxen">
              </button>
            </div>
            <!-- Zoom-Bild -->
            <div v-if="visibleImage">
              <img
                :src="zoomImg"
                :style="{left: getBigPosition +'%', top: 0, width: 'auto', height: 100+'%'}"
                class="zoomBild"/>
              <!-- Zoomboxen -->
              <div v-for="(j, index2) in zoomBox" :key="index2">
                <button
                  :id=j[0]
                  v-if="visibleImage"
                  :style="{left: j[1]+'%', top: j[2]+'%', width: j[3]+'%', height: j[4]+'%'}"
                  class="zoomBoxen"
                  @click="sendAnswer">
                </button>
              </div>
            </div>
          </div> 
    
    </div>
    </template>
    
    <script>

    export default {
    data (){ // Datenobjekte die in der gesamten Komponente erreichbar sind
      return {
        currentRaumID: '', // Welches Tor wird angezeigt
        getBigPosition: '', // Verschiebung der Elemente in der Zoom-Ansicht
        hitBox: [], // Hitboxen
        zoomBox:[], // Zoomboxen
        zoomImage: '', // Zoom-Bild
        topImage: '', // Oben-Bild
        visibleImage:'', // Boolean zur anzeige des Zoom-Bildes
        images: [], // Alle Seitenansichten
        auto: { // Auto-Objekt zum navigieren
          "name": this.fahrzeugname,
          "seiten": [
            "links",
            "hinten",
            "rechts",
            "oben"
          ]
        },

        
      }
    },
    props: { // Übergebener Wert der Eltern-Komponente
      imgCount: Number,
      visibleImg: Boolean,
      fahrzeugname: String,
      topShow: Boolean,

      //für Quiz erforderlich
      zeigeKorrekteAntwort: Boolean,
      korrekteAntwortBearbeitet: Boolean,
      korrektesTor: Number,
      korrektesFach: Number,
      korrekteSeite: Number,
    },
    components: { // Eingebundene Kinder-Komponenten
    },
    methods: { // Methoden die in der gesamten Komponente erreichbar sind 
      async fillHitBox ( seite ) { // Funktion, um  die Hitboxen des geschlossenen Autos zu bekommen
      let response = await this.makeRequest( // Hitboxen werden geladen
        'GET',
        `https://elwing.cs.hs-rm.de:3000/gethitboxraum?Fahrzeugtyp=${this.fahrzeugname}&Fachseite=${this.auto.seiten[seite]}`,
        null
      );
      this.buildBoxHit( JSON.parse( response ).result ); // Die Hitboxen werden gebaut
    },
    async fillZoomBox ( seite, tor ) { // Funktion,um die Zoomboxen des offenen Tores zu bekommen 
      let response = await this.makeRequest( // Zoomboxen werden geladen
        "GET",
        `https://elwing.cs.hs-rm.de:3000/gethitboxfach?Fahrzeugtyp=${this.fahrzeugname}&Fachseite=${this.auto.seiten[seite]}&RaumID=${tor}`,
        null
      );
      this.buildBoxZoom( JSON.parse( response ).result ); // Die Zoomboxen werden gebaut
      for ( let i = 0; i < this.zoomBox.length; i++ ) { // Verschiebung um die Zoomboxen auf das Bild des offenen Tores zu brigen
        this.zoomBox[i][1] = Number( this.getBigPosition ) + Number( this.zoomBox[i][1] );
      }
    },
    clickBox ( e ) { // Funktion um das Bild der Hitbox zu bekommen 
      let i = Math.abs( this.imgCount ) % this.images.length;
      this.zoomImage = 
        `https://elwing.cs.hs-rm.de:3000/autoOffen?auto=${this.fahrzeugname}&ansicht=${this.auto.seiten[i]}&tor=${e.target.id}`;
      let tmp = eval( 'this.hitBox[' + e.target.id + ']' );
      this.getBigPosition = tmp[1] - 5; // Verschiebung des Bildes von der Hitbox
      this.fillZoomBox( i, e.target.id );
      this.currentRaumID = e.target.id;
      this.visibleImage = true;
      this.$emit('visibleImage', this.visibleImage) // Veränderung der Visible-Variable mitteilen
    },
    buildBoxHit ( coords ) { // Funktion um die Hitboxen zu bauen
      this.hitBox = [];
      for ( let i = 0; i < coords.length/4; i++ ){
        let currentBox= [];
        currentBox[0] = coords[i * 4 + 0].RaumID;
        for( let j = 0; j < 4; j ++ ) {
          switch ( coords[i * 4 + j].Koordinate ) {
          case 'x':
            currentBox[1] = coords[i * 4 + j].Pixel;
            break;
          case 'y':
            currentBox[2] = coords[i * 4 + j].Pixel;
            break;
          case 'width':
            currentBox[3] = coords[i * 4 + j].Pixel;
            break;
          case 'height':
            currentBox[4] = coords[i * 4 + j].Pixel;
            break;
          default:
            break;
          }
        }
        this.hitBox.push( currentBox );
      }
    },
    buildBoxZoom ( coords ) { // Funktion um die Zoomboxen zu bauen leider doppelt
      this.zoomBox = [];
      for ( let i = 0; i < coords.length/4; i++ ){
        let currentBox= [];
        currentBox[0] = coords[i * 4 + 0].KoordinatenID
        for( let j = 0; j < 4; j++ ) {
          switch ( coords[i * 4 + j].Koordinate ) {
          case 'x':
            currentBox[1] = coords[i * 4 + j].PixelFach;
            break;
          case 'y':
            currentBox[2] = coords[i * 4 + j].PixelFach;
            break;
          case 'width':
              currentBox[3] = coords[i * 4 + j].PixelFach;
            break;
          case 'height':
            currentBox[4] = coords[i * 4 + j].PixelFach;
            break;
          default:
            break;
          }
        }
        this.zoomBox.push( currentBox );
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
    sendAnswer: function( e ) {     //Quiz wird benachrichtigt, welches Fach zuletzt angeklickt wurde 
        let KoordinatenID = e.target.id;
        let Fachseite = this.auto.seiten[this.imgCount % this.images.length];
        let RaumID = this.currentRaumID;
        this.$emit("values", KoordinatenID, Fachseite, RaumID);
    },

    colorCompartment: function(element) {   //Funktion zum Färben des Faches 'element'
      try {                                 //Wenn die Farbe nicht direkt geändert werden kann, wird ein Mutationobserver erstellt
        document.querySelector(`#${CSS.escape(element)}`).style.backgroundColor = 'rgba(85, 245, 32, 0.4)';
      } catch (error) {                     //Mutationobserver sendet Signal, wenn sich Child-Elemente von der Klasse 'zoomBoxen' ändern
        console.error(error);
        var target = document.querySelector('.zoomBoxen');
        var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          console.log("Mutation-Type" + mutation.type);
          document.querySelector(`#${CSS.escape(element)}`).style.backgroundColor = 'rgba(85, 245, 32, 0.4)';
          });
        });
        var config = { attributes: true, childList: true, characterData: true }
        observer.observe(target, config);
      }

    },

    clickCorrectDoor(element) {     //Funktion zum Anklicken des Tores 'element'
      try {                         //Wenn das Tor nicht direkt angeklickt werden kann, wird ein Mutationobserver erstellt
        setTimeout( () => document.querySelector(`#${CSS.escape(element)}`).click(), 200);
      } catch (error) {             //Mutationobserver sendet Signal, wenn sich Child-Elemente von der Klasse 'hitBoxen' ändern
        console.error(error);
        var target = document.querySelector('.hitBoxen');
        var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          console.log("Mutation-Type in clickDoor" + mutation.type);
          document.querySelector(`#${CSS.escape(element)}`).click();
        });
        });
        var config = { attributes: true, childList: true, characterData: true }
        observer.observe(target, config);

      }
    }

  },
  computed: { // Funktionen die auf Veränderungen von Variablen reagieren
    currentImg () { // Zeigt das aktuelle Seiten-Bild an
      let i = Math.abs(this.imgCount) % this.images.length
      this.fillHitBox(i);
      return this.images[i];
    },
    zoomImg: function() { // Zeigt das aktuelle offene Tor an
      return this.zoomImage;
    }
  },
  created(){ // Wenn die komponente ertsllt wird, werden alle Seiten-Bilder geladen
    this.images[0] = `https://elwing.cs.hs-rm.de:3000/auto?name=${this.fahrzeugname}&seite=links`;
    this.images[1] = `https://elwing.cs.hs-rm.de:3000/auto?name=${this.fahrzeugname}&seite=hinten`;
    this.images[2] = `https://elwing.cs.hs-rm.de:3000/auto?name=${this.fahrzeugname}&seite=rechts`;
    this.topImage = `https://elwing.cs.hs-rm.de:3000/auto?name=${this.fahrzeugname}&seite=oben`;
  },
  beforeUpdate() { // Befor die Komponente verändert wird
    if (this.topShow) this.images[3]= this.topImage // Überprüfung, ob das obere Bild angezeogt werden soll
    else this.images.length = 3
  },
  watch: {
    korrekteAntwortBearbeitet: function(){        //Anzeigen der korrekten Antwort in QuizLocate / Anzeigen des abgefragten Faches in QuizName
      if (this.korrekteAntwortBearbeitet && this.zeigeKorrekteAntwort) {
        this.clickCorrectDoor(this.korrektesTor);
        setTimeout( () => this.colorCompartment(this.korrektesFach), 1000);
      }
    },
    visibleImg: function(){
      this.visibleImage = this.visibleImg;
    }
  }
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
</style>