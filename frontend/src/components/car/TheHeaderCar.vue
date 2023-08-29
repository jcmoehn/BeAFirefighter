<!-- Author: Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <!-- Bild mit Text -->
  <div class="startHeader full height p-4">
    <div class="m-5 p-5"></div>
      <div class="m-4 p-4"></div>
      <div>
        <h1 class="text-white display-1" style="font-family: Times, serif">Fahrzeuge</h1> 
        <div class="m-2 p-2"></div>
        <vue-typed-js :strings="['An diesen Fahrzeugen kannst du lernen<br>und dein Wissen erweitern.<br>Schaue dir die einzelnen Autos an<br>und siehe wie sie beladen werden.']" :showCursor="false" :startDelay="450" :typeSpeed="15">
          <h2 class="text-white display-5" style="font-family: Times, serif"><span class="typing"></span></h2>
        </vue-typed-js>     
      </div>
      <div class="m-5 p-5"></div>
      <div class="m-3 p-3"></div>
      <div class="text-center" v-if="buttonsichtbar">
        <!-- Scroll-Button -->
        <button class="scrollButton">
          <img src="@/assets/scrollDown.png" width="50%" v-scroll-to="'#scrolling'">
        </button>   
    </div>
    <div id="scrolling"></div>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
export default {
  data() { // Datenobjekte die in der gesamten Komponente erreichbar sind
    return {
      buttonsichtbar: false, // Anzeige des Scroll-Buttons
    };
  },
  methods: { // Methoden die in der gesamten Komponente erreichbar sind
    buttonsichtbarFunction() {  // Funktion um die Zeit der Anzeige des Scroll-Buttons zu ermitteln
      setTimeout(() => {
        this.buttonsichtbar = true;
      }, 4300);
    }
  },
  created() { // Wenn die Komponente ertstellt wird
    this.buttonsichtbarFunction();
  },
};
</script>

<!-------- CSS -------->
<style scoped>
  .startHeader { /* Das Parallax richtig anzeigen */
    background: url('../../assets/cars.jpg') no-repeat center center;
    background-color: black;
    background-attachment: fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    min-height: 900px;
  }
  button { /* Scroll-Button */
    background-color:rgba(240, 240, 240,0.6);
    border:none;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1), 0 6px 20px 0 rgba(0,0,0,0.1);
    border-radius: 15px;
  }
  button:hover {
    background-color:rgb(223, 223, 223);
  }
  @media screen and (max-width: 100em) { /* Schrift verkleinern */
    h2 {
      font-size: 2em;
    }
  }
  @media screen and (max-width: 80em) { /* Schrift verkleinern */
    h2 {
      font-size: 1.5em;
    }
  }
  @media screen and (max-width: 65em) { /* Schrift verkleinern */
    h2 {
      font-size: 1.25em;
    }
  }
  @media screen and (max-width: 100em) { /* Schrift verkleinern */
    h1 {
      font-size: 5em;
    }
  }
  @media screen and (max-width: 80em) { /* Schrift verkleinern */
    h1 {
      font-size: 3.5em;
    }
  }
  @media screen and (max-width: 65em) { /* Schrift verkleinern */
    h1 {
      font-size: 3em;
    }
  }
</style>
