<!-- Author: Jannik Weiß, Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <div>
    <TheHeaderEditor/>
    <b-overlay :show="overlay" rounded="sm">
    <div class="full height p-4">
      <div class="p-4 p-md-5" v-if="online">
        <b-progress v-if="currentComponent != ''" :value="value" :max="max" show-progress animated variant="success"></b-progress>
        <div>
          <div class="mt-5">
            <!-- Aktive Komponente des Editors -->
            <KeepAlive>
              <component :is="currentComponent" ref="keepAliveComponent" @type="getType" @previewImage="getPreviewImage" @links="getLinks" @rechts="getRechts" @hinten="getHinten" @oben="getOben"/>
            </KeepAlive>
          </div>
          <div class="mt-5" v-if="currentComponent!='TheInfoFile' && currentComponent != ''">
            <b-button variant="danger" style="float: left" @click="prev">Zurück</b-button>
          </div>
          <div class="mt-5">
            <b-button v-if="currentComponent!='TheTopForm' && currentComponent != ''" variant="primary" style="float: right" @click="$refs.keepAliveComponent.saveAll(); next()">Weiter</b-button>
            <b-button ref="sendButton" v-if="currentComponent !='TheLeftForm' &&currentComponent !='TheRightForm' &&currentComponent !='TheBackForm' &&currentComponent !='TheInfoFile' && currentComponent != ''" variant="primary" style="float: right" @click="value +=20; overlay = true; $refs.keepAliveComponent.saveAll(); sendALL()">Senden</b-button>
          </div>
        </div>
        <div style="text-align: center;" class="pb -5" v-if="currentComponent === '' && correct === ''">
          <h4 class="display-3">Super!</h4>
          <h4 class="display-5">Dein Auto ist jezt bei uns hinterlegt</h4>
        </div>
        <div v-if="currentComponent === '' && correct != ''" class="alert alert-danger text-center">
            <h4 class="display-5">Ein Problem ist aufgetreten: {{correct}}</h4>
        </div>
      </div>
      <div v-else class="text-center pt-4 pb-5">
        <img src="../assets/Unavailable.png" alt="" width="25%">
        <h3 class="display-2">Der Editor ist leider nicht verfügbar!</h3>
      </div>
    </div>
  </b-overlay>
  </div>
</template>

<!-------- JAVASCRIPT --------> 
<script>
  import TheInfoFile from '../components/editor/form/TheInfoFile.vue';
  import TheLeftForm from '../components/editor/form/TheLeftForm.vue';
  import TheRightForm from '../components/editor/form/TheRightForm.vue';
  import TheTopForm from '../components/editor/form/TheTopForm.vue';
  import TheBackForm from '../components/editor/form/TheBackForm.vue';
  import TheHeaderEditor from '../components/editor/TheHeaderEditor.vue';
  import axios from 'axios';

  export default {
    components: {
      TheInfoFile,
      TheLeftForm,
      TheBackForm,
      TheRightForm,
      TheTopForm,
      TheHeaderEditor,
    },
    data() {
      return {
        value: 0,
        max: 100,
        overlay: false,
        visibleArray: [
          {component: 'TheInfoFile'},
          {component: 'TheLeftForm'},
          {component: 'TheBackForm'},
          {component: 'TheRightForm'},
          {component: 'TheTopForm'},
        ],
        count: 0,
        currentComponent: 'TheInfoFile',
        links: null,
        rechts: null,
        oben: null,
        hinten: null,
        type: null,
        previewImage: null,
        correct: '',
        online: true,
      };
    },
    methods: {
      next() {
        this.visibleArray[this.count].success= true;
        this.count++;
        this.currentComponent = this.visibleArray[this.count].component;
        this.value += 20
      },
      prev() {
        this.visibleArray[this.count].success= false;
        this.count--;
        this.currentComponent = this.visibleArray[this.count].component;
        this.value -= 20
      },
      getType(type) {
        this.type = type;
      },
      getPreviewImage(previewImage) {
        this.previewImage = previewImage;
      },
      getLinks(links) {
        this.links = links;
      },
      getRechts(rechts) {
        this.rechts = rechts;
      },
      getOben(oben) {
        this.oben = oben;
      },
      getHinten(hinten) {
        this.hinten = hinten
      },

      async sendALL() {
        this.$refs.sendButton.disabled = true;
        let theFinalCar = {
          type: this.type,
          links: { 
            hitBoxen: this.links.hitBoxen,
            zoomBoxen: this.links.zoomBoxen,
            werkzeuge: this.links.werkzeuge,
            sonderwerkzeuge: this.links.sonderwerkzeuge,
          },
          rechts: { 
            hitBoxen: this.rechts.hitBoxen,
            zoomBoxen: this.rechts.zoomBoxen,
            werkzeuge: this.rechts.werkzeuge,
            sonderwerkzeuge: this.rechts.sonderwerkzeuge,
          },
          hinten: { 
            hitBoxen: this.hinten.hitBoxen,
            zoomBoxen: this.hinten.zoomBoxen,
            werkzeuge: this.hinten.werkzeuge,
            sonderwerkzeuge: this.hinten.sonderwerkzeuge,
          },
          oben: { 
            hitBoxen: this.oben.hitBoxen,
            zoomBoxen: this.oben.zoomBoxen,
            werkzeuge: this.oben.werkzeuge,
            sonderwerkzeuge: this.oben.sonderwerkzeuge,
          },
        }
        await this.sendData('POST', '/newEditorentry', theFinalCar)
        await this.sendPicture('POST', `/previewImage?Fahrzeugtyp=${this.type}`, this.previewImage)
        await this.sendPicture('POST', `/aussenImage?Fahrzeugtyp=${this.type}&Seite=links`, this.links.bild)
        await this.sendPicture('POST', `/aussenImage?Fahrzeugtyp=${this.type}&Seite=rechts`, this.rechts.bild)
        await this.sendPicture('POST', `/aussenImage?Fahrzeugtyp=${this.type}&Seite=hinten`, this.hinten.bild)
        await this.sendPicture('POST', `/aussenImage?Fahrzeugtyp=${this.type}&Seite=oben`, this.oben.bild)
        for(let i = 0; i < this.links.zoomImg.length; i++) {
          await this.sendPicture('POST', `/innenImage?Fahrzeugtyp=${this.type}&Seite=links&index=${i}`, this.links.zoomImg[i])
        }
        for(let i = 0; i < this.rechts.zoomImg.length; i++) {
          await this.sendPicture('POST', `/innenImage?Fahrzeugtyp=${this.type}&Seite=rechts&index=${i}`, this.rechts.zoomImg[i])
        }
        for(let i = 0; i < this.oben.zoomImg.length; i++) {
          await this.sendPicture('POST', `/innenImage?Fahrzeugtyp=${this.type}&Seite=oben&index=${i}`, this.oben.zoomImg[i])
        }
        for(let i = 0; i < this.hinten.zoomImg.length; i++) {
          await this.sendPicture('POST', `/innenImage?Fahrzeugtyp=${this.type}&Seite=hinten&index=${i}`, this.hinten.zoomImg[i])
        }
        setTimeout( ()=> this.overlay = false, 2000);
        this.currentComponent = '';
      },

      async sendPicture(method, url, data) {
        return await new Promise(function (resolve) {
          let xhr = new XMLHttpRequest();
          xhr.open(method, 'https://elwing.cs.hs-rm.de:3000'+url);
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              resolve (xhr.response);
            } else {
              this.overlay = false;
              this.currentComponent = '';
              this.correct = 'Die Bilder konnten nicht eingefügt werden';
            }
          };
          xhr.onerror = function () {
            this.overlay = false;
            this.currentComponent = '';
            this.correct = "Versuche es später erneut";
          };
          xhr.send(data);
        });
      },

      sendData(method, path, data) {
          axios({
            method: method,
            url: 'https://elwing.cs.hs-rm.de:3000'+ path,
            data: data
          })
          .catch((error) => {
            this.overlay = false;
            this.currentComponent = '';
            if(error.request.data === '') this.correct = "Versuche es später erneut";
            else {
              this.correct = error.response.data.meldung;
            }
          })
      },
    },
    created() {
      axios({
            method: 'GET',
            url: 'https://elwing.cs.hs-rm.de:3000/getfahrzeug',
          })
          .catch(() => {
            this.online = false;
          })
    }
  }
</script>
