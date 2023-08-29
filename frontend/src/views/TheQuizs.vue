<!-- Author: Emanuel Bisso, Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <div>
    <TheHeaderQuiz />
    <div class="full height p-4" v-if="fahrzeugtypen != ''">
      <!-- Alle Fahrzeuge anzeigen -->
      <div class="p-4 p-md-5">
        <div class="row row-cols-80 row-cols-lg-4 justify-content-center">
          <div class="text-center" v-for="(i, index) in fahrzeugtypen.result" :key="index">
            <button @click="$bvModal.show('modal1'); fahrzeugname=i.Fahrzeugtyp;" class="m-4">
              <div style="display: flex; justify-content: center; align-items: center;" class="mb-1">
                <img :src='`https://elwing.cs.hs-rm.de:3000/autoliste?auto=${i.Fahrzeugtyp}`' height="180" width="320" class="m-3">
              </div>
              <h5 class="ml-md-4 mr-md-4 text-dark text-center mb-3">
                {{i.Fahrzeugtyp}}
              </h5>
            </button>
          </div>
        </div>
        <!-- Ein Fahrzeug anzeigen -->
        <TheQuizNavigation :fahrzeugname="fahrzeugname"/>
      </div>
    </div>
    <!-- Fehlermeldung -->
    <div v-else class="text-center pt-4 pb-5">
      <img src="../assets/Unavailable.png" alt="" width="25%">
      <h3 class="display-2">Es sind leider keine Fahrzeuge verfügbar</h3>
    </div>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
import TheQuizNavigation from '@/components/quiz/TheQuizNavigation.vue'
import TheHeaderQuiz from '@/components/quiz/TheHeaderQuiz.vue'
export default {
  data() { // Datenobjekte die in der gesamten Komponente erreichbar sind
    return {
      fahrzeugtypen: '', // Namen aller Fahrzeuge
      fahrzeugname: '', // Name des angeklickten Fahrzeuges
    };
  },
  components:{ // Eingebundene Kinder-Komponenten
    TheQuizNavigation,
    TheHeaderQuiz,
  },
  created() { // Wenn die Komponente ertstellt wird, bekommt alle Fahrzeugnamen
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'https://elwing.cs.hs-rm.de:3000/getfahrzeug', false);
    xmlHttp.send( null );
    this.fahrzeugtypen =  JSON.parse(xmlHttp.responseText);
    this.buttonsichtbarFunction();
  },
};
</script>

<!-------- CSS -------->
<style scoped>
  button { /* Einzelne Fahrzeugkarten */
    background-color:rgba(240, 240, 240,0.6);
    border:none;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1), 0 6px 20px 0 rgba(0,0,0,0.1);
    border-radius: 15px;
  }
  button:hover {
    background-color:rgb(223, 223, 223);
  }
</style>
