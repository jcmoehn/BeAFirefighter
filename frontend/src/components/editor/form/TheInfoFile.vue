<!-- Author: Jannik Weiß, Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <div>
    <b-card>
      <b-card-header>
        <b-row>
        <b-col ><h4>Allgemeines Infos über dein Auto</h4></b-col>
        <b-col cols="1" style="text-align:right;">
          <b-button 
            v-b-popover.hover.right="'Hier findest du in naher Zukunft eine Anleitung, die dich durch den Editor leitet und dir tolle Tipps für die Bearbeitung gibt.'"
            title="Hilfe"
            class="closeButton"
          >
            ?
          </b-button>
        </b-col>
      </b-row>
      </b-card-header>

      <!-- Eingabefeld für Fahrzeugtyp -->
      <b-form-group
        label="Bitte gebe hier den Typ/Namen deines Autos an:"
        class="mt-3"
      >
        <b-input 
          v-model="type"
          type="text"
          placeholder="Typ des Autos"
          :state="nameState"
        ></b-input>
      </b-form-group>

      <!-- Hochladen des Vorschaubilds für die Fahrzeugliste -->
      <b-form-group
        label="Bitte füge hier ein Vorschaubild deines Autos ein:"
        class="mt-3"
        description="(Bidlformat: 'JPEG', Dateigröße: maximal 200KB, Idealformat: 1024 x 480)"
      >
        <b-form>
          <div v-if="correct != ''" class="alert alert-danger text-center">
            Ein Problem ist aufgetreten: {{correct}}
          </div>
          <div class="d-flex mb-3">
            <b-form-file accept="image/jpeg" ref="uploadField" v-model="previewImage" class="w-auto flex-grow-1"></b-form-file>
            <b-button ref="clearButton" v-if="hasImage" variant="danger" class="ml-3" @click="clearImage()">Clear image</b-button>
          </div>
        </b-form>
        <img v-if="hasImage" :src=imageSrc>
      </b-form-group>
    </b-card>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
  const base64Encode = data =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  export default {
    data() {
      return {
        type: '',
        previewImage: null,
        previewImageSrc: null,
        correct: '',
      };
    },
    computed: {
      nameState() {
        return this.type.length > 2 ? true : false
      },
      hasImage() {
        return this.previewImage;
      },
      imageSrc() {
        return this.previewImageSrc;
      }
    },
    watch: {
      previewImage(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue.size >= 604800) {
            this.clearImage();
            this.correct = "Die Datei ist zu groß!"
          }
          if (newValue.type != "image/jpeg") {
            this.clearImage();
            this.correct = "Die Datei ist nicht im JPEG Vormat!"
          }
          else if (newValue) {
            base64Encode(newValue)
              .then(value => {
                this.previewImageSrc = value;
              })
              .catch(() => {
                this.previewImageSrc = null;
              });
          } else {
            this.previewImageSrc = null;
          }
        }
      },
    },
    methods: {
      saveAll() {
        console.log("TheInfoFile.saveAll(type): " + this.type);
        console.log("TheInfoFile.saveAll(previewImage): " + this.previewImage);
        this.$emit('type', this.type);
        this.$emit('previewImage', this.previewImage);
      },
      clearImage() {
        this.previewImage = null;
      },
    }
  }
</script>

<style>
  .closeButton:hover {
    color: white;
  }
</style>
