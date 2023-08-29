<!-- Author: Jan-Christopher Möhn -->
<!-- Erste Verison mit Emanuel Bisso erstellt-->
<!-------- HTML -------->
<template>
  <div>
    <!-- Bild mit Text -->
    <div id="home-page" class="full height p-4">
      <div>
        <div class="m-5 p-5"></div>
        <div class="m-2 p-2"></div>
        <div>
          <vue-typed-js :strings="['Entdecke<br>Feuerwehrautos<br>auf eine <i><b>neue</b></i><br>Art und Weise!']" :showCursor="false">
            <h1 class="text-white display-1" style="font-family: Times, serif"><span class="typing"></span></h1>
          </vue-typed-js>      
        </div>
        <div class="m-5 p-5"></div>
        <div class="text-center" v-if="buttonsichtbar">
          <button class="scrollButton">
            <img src="@/assets/scrollDown.png" width="50%" v-scroll-to="'#about'">
          </button>   
      </div>
      </div>
    </div>
    <!-- Über die einzelnen Themenbereiche der Webseite-->
    <div id="about" class="p-4 p-md-5">
      <div class="row">
        <div class="col-lg">
          <div style="display: flex; justify-content: center; align-items: center;">
            <a href="/cars">
              <img src="@/assets/Feuerwehrauto.jpg" height="200" class="m-5" style="border-radius:50%">
            </a>
          </div>
          <h5 class="ml-md-4 mr-md-4 text-dark text-center mb-5">
            In unserer Fahrzeugansicht kann man sich die erstellten Autos bis ins kleinste Detail angucken.
            Man kann Auf ein Fahrzeug klicken um in unsere selbst entwickelte Fahrzeugansicht zu kommen.
            Dort kann man um das Auto gehen und sich alle Seiten von einem Auto angucken.
            Klickt man auf ein Tor öffnet es sich. Daraufhin kann man sich anzeigen lassen, was sich in unterschidlichen Fächern befindet.
          </h5>
        </div>
        <div class="col-lg">
          <div style="display: flex; justify-content: center; align-items: center;">
            <a href="/quizs"><img src="@/assets/Quiz.webp" height="200" class="m-5" style="border-radius:50%"></a>
          </div>
          <h5 class="ml-md-4 mr-md-4 text-dark text-center mb-5">
            In unsererm Quiz kann man sein Wissen auf die Probe stellen.
            Man kann auf eines der hinterlegten Fahrzeuge klicken und sich in zwei Quizarten an dem Auto testen lassen.
            Bei der ersten Quizart geht es darum, das vorgegebene Werkzeug einem Fach zuzuweisen.
            In der zweiten Quizart geht es darum, alle Werkzeuge zu erraten, die sich in dem vorgegebenen Fach befinde.
          </h5>
        </div>
        <div class="col-lg">
          <div style="display: flex; justify-content: center; align-items: center;">
            <a href="/editor"><img src="@/assets/Editor.png" height="200" class="m-5" style="border-radius:50%"></a>
          </div>
          <h5 class="ml-md-4 mr-md-4 text-dark text-center mb-5">
            In unserem Editor kannst du dein eigenes Feuerwehrauto konfigurieren.
            Mit unserer selbstentwickelten Editor-Methode wird man Schritt für Schritt durchgeleitet.
            Wenn man fertig ist, wird das Auto bei uns hinterlegt.
            Dannach kann man es selbstverständlich angucken und direkt im Quiz testen.
            So kannst du die Feuerwehrautos, die in euere Feuerwehr benutzt werden auch auf unserer Website benutzen.
          </h5>
        </div>
      </div>
    </div>
    <!-- Kontaktformular -->
    <div id="contact" class="p-4 p-md-5">
      <div class="row justify-content-center mt-5 mb-5">
        <div v-if="show_contact == true" class="lg">
          <h2 class="text-white text-center">Haben Sie Fragen?</h2>
          <p class="text-center text-white">Kontaktieren Sie uns, indem Sie das unten aufgeführte Formular ausfüllen</p>
          <div v-if="contact_notice != ''" class="alert alert-danger text-center">
            Ein Problem ist aufgetreten: {{contact_notice}}
          </div>
          <form @submit.prevent="sendContactMessage()">
            <div class="form-group">
              <input v-model="contact_email"
                     type="email"
                     class="form-control"
                     placeholder="Geben Sie Ihre E-Mail ein"
                     >
              <textarea v-model="contact_message"
                        class="form-control mt-3"
                        placeholder="Geben Sie Ihre Nachricht ein"
                        rows="5"
              ></textarea>
            </div>
            <div class="text-end mt-2">
              <button type="submit" class="btn btn-primary">Send Message</button>
            </div>
          </form>
        </div>
        <div v-else class="col-lg-6">
          <h3 class="text-white text-center">Nachricht wurde erfolgreich versendet!</h3>
          <p class="text-white text-center">Danke, dass Sie uns kontaktiern. Wir melden uns sobald wie möglich.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
  export default {
    data () { // Datenobjekte die in der gesamten Komponente erreichbar sind
      return {
        show_contact: true, // ob Kontaktnachricht versendet wurde
        contact_email: '', // Eingegebene Email-Adresse
        contact_message: '', // Eingegebene Nachricht
        contact_notice: '', // Nachricht wenn ein Fehler aufgetreten ist
        buttonsichtbar: false, // Anzeige des Scroll-Buttons
      }
    },
    methods: { // Methoden die in der gesamten Komponente erreichbar sind
      sendContactMessage() { // Funktion um die Kontaktnachricht senden
        if (!this.validEmail(this.contact_email)) { // Fehlerüberprüfung
          this.contact_notice = 'Die E-Mail-Addresse hat eine schlechte Form!';
        } else if (this.contact_message.length < 10) {
          this.contact_notice = "Deine Nachricht ist zu kurz";
        } else {
          const url = ``
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          };
          fetch(url, requestOptions); // Kontaktnachricht senden
          this.show_contact = false;
        }
      },
      validEmail(email) { // Funktion um die Korrektheit der Email-Adresse zu überprüfen
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },
      buttonsichtbarFunction() { // Funktion um die Zeit der Anzeige des Scroll-Buttons zu ermitteln
        setTimeout(() => {
          this.buttonsichtbar = true;
        }, 4100);
      }
    },
    created() { // Wenn die Komponente ertstellt wird
      this.buttonsichtbarFunction();
    },
  }
</script>

<!-------- CSS -------->
<style scoped>
  #home-page { /* Das Parallax richtig anzeigen */
    background: url('../../assets/Hintergrund-dunkel.jpg') no-repeat center center;
    background-color: black;
    background-attachment: fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    min-height: 900px;
  }
  #about { /* Informationsanzeige */
    min-height: 40vh;
    background-color: white;
    position: relative;
  }
  #contact { /* Kontaktanzeige*/
    background-color: #445669;
  }
  a { /* Link selbst dekoriert */
      text-decoration: none;
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
  button { /* Scroll-Button */
    background-color:rgba(240, 240, 240,0.6);
    border:none;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1), 0 6px 20px 0 rgba(0,0,0,0.1);
    border-radius: 15px;
  }
  button:hover {
    background-color:rgb(223, 223, 223);
  }
</style>
