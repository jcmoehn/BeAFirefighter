<!-- Author: Jannik Weiß, Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <b-container class="mt-3" fluid>
    <b-form>
      <div v-if="correct != ''" class="alert alert-danger text-center">
        Ein Problem ist aufgetreten: {{correct}}
      </div>
      <div class="d-flex mb-3">
        <b-form-file accept="image/jpeg" ref="uploadField" v-model="image" placeholder="Choose an image" class="w-auto flex-grow-1"></b-form-file>
        <b-button ref="clearButton" v-if="hasImage" variant="danger" class="ml-3" @click="clearImage()">Clear image</b-button>
      </div>
    </b-form>
    <TheJcrop v-if="hasImage" :valueImg="imageSrc" :key="test" @arrayValues="arrayValues" :aussenWidth="aussenWidth" :aussenHeight="aussenHeight" @aussenEmit="aussenEmit"/>
  </b-container>
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
  import TheJcrop from './TheJcrop.vue';
  export default {
    components: {
      TheJcrop
    },
    props: ['aussenWidth', 'aussenHeight'],
    data() {
      return {
        image: null,
        imageSrc: null, test: '',
        correct: '',
      };
    },
    computed: {
      hasImage() {
        return this.image;
      }
    },
    watch: {
      image(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue.size >= 604800) {
            this.clearImage();
            this.correct = "Die Datei ist zu groß!"
          }
          if (newValue.type != "image/jpeg") {
            this.clearImage();
            this.correct = "Die Datei ist nicht im JPEG Vormat!"
          }
          if (newValue) {
            base64Encode(newValue)
              .then(value => {
                this.imageSrc = value;
                this.test++;
              })
              .catch(() => {
                this.imageSrc = null;
              });
          } else {
            this.imageSrc = null;
          }
        }
      },
    },
    methods: {
      /* Resets the whole editor */
      reset() {
        Object.assign(this.$data,this.$options.data.call(this));
      },
      resetParent() {
        this.$parent.$parent.reset();
      },
      clearImage() {
        this.image = null;
      },
      onSubmit() {
        if (!this.image) {
          alert("Please select an image.");
          return;
        }
      },
      arrayValues(coords) {
        this.$emit('arrayValues', coords)
        this.$emit('image', this.image)
      },
      aussenEmit(width, height) {
        this.$emit('aussenEmit', width, height)
      }
    }
  };
</script>
  