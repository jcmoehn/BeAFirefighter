<!-------- HTML -------->
<!-- Author: Jan-Christopher Möhn -->
<template>
    <!-- Anzeigen der Hilfe-->
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
      props: {
        fahrzeugname: String,
      },
      data(){
        return {
          text: 'Hier kannst du dich selbst über das ' + this.fahrzeugname + ' abfragen.' +
                'Wähle hierfür erst eine Quizart aus und fang an, zu üben.' +
                'In der Locate-Quizart wird dir ein Werkzeug angezeigt und du musst einfach nur das Fach wählen, welches dieses Fach beinhaltet.' + 
                'Die andere Quizart markiert ein zufälliges Fach grün und du wählst das Werkzeug aus, das sich in dem Fach befindet. Viel Spaß!',
        }
      }
    }
  </script>