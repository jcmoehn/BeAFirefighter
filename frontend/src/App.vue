<!-- Author: Jan-Christopher Möhn, Emanuel Bisso, Jannik Weiß -->
<!-------- HTML -------->
<template>
  <div>
    <div style="position:fixed; width:100%; z-index:100">
      <div v-if="!scroll">
        <TheNavbarWOB/>
      </div>
      <div v-else >
        <TheNavbarDark/>
      </div>
    </div>
    <router-view></router-view>
    <TheFooterDark/>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
import TheNavbarDark from '@/components/home/TheNavbarDark.vue'
import TheFooterDark from '@/components/home/TheFooterDark.vue'
import TheNavbarWOB from '@/components/home/TheNavbarWOB.vue'
export default{
  data() { // Datenobjekte die in der gesamten Komponente erreichbar sind
    return {
      scroll: false,
    }
  },
  components: { // Eingebundene Kinder-Komponenten
    TheNavbarDark,
      TheNavbarWOB,
      TheFooterDark,
  },
  methods: { // Methoden die in der gesamten Komponente erreichbar sind
    scrollFunction() { // Methode die schaut, ob der User nach unten gescrollt hat
      if(Math.round(window.pageYOffset) > 120)  this.scroll = true;
      else this.scroll = false;
    }
  },
  created() { // Wenn die Komponente erstellt wir, wird ein Event-Listener initialisiert
    window.addEventListener('scroll', this.scrollFunction);
  },
}
</script>