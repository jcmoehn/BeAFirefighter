<!-- Author: Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <b-button
    v-b-popover.hover.right="text"
    title="Hilfe für die Fahrzeugansicht"
    class="closeButton"
  >
    ?
  </b-button>
</template>

<!-------- JAVASCRIPT -------->
<script>
  export default {
    props: { // Übergebener Wert der Eltern-Komponente
      fahrzeugname: String,
    },
    data() { // Datenobjekte die in der gesamten Komponente erreichbar sind
      return {
        text: 'Hier kannst du dich durch das ' + this.fahrzeugname + ' klicken.' +
              'Indem du auf eine Box klickst, die farblich hervorgehoben ist, kannst du sie öffen.' +
              'Wenn du eine Box geöffnet hast, kannst du dir die einzelnen Werkzeuge anschauen, die in den verschiedenen Boxen liegen.',
      }
    }
  }
</script>