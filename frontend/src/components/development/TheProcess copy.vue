<template>
  <div class="frame">
    <h1 class="startHeader">
      Editor
    </h1>
    <h4 class="blockText">
      In diesem Editor kannst du deine eigenen Fahrzeuge speichern. Hier kannst du individuell deine Beladung anpassen.
    </h4>
    <b-row>
      <b-col cols="3"></b-col>
      <b-col>
        <b-button style="border-radius: 100%" variant="success" v-if="visibleArray[0].success==true" @click="goTo(visibleArray[0], 0)"></b-button>
        <b-button style="border-radius: 100%" v-else @click="goTo(visibleArray[0], 0)"></b-button>
      </b-col>
      <b-col>
        <b-button style="border-radius: 100%" variant="success" v-if="visibleArray[1].success==true" @click="goTo(visibleArray[1], 1)"></b-button>
        <b-button style="border-radius: 100%" v-else @click="goTo(visibleArray[1], 1)"></b-button>
      </b-col>
      <b-col>
        <b-button style="border-radius: 100%" variant="success" v-if="visibleArray[2].success==true" @click="goTo(visibleArray[2], 2)"></b-button>
        <b-button style="border-radius: 100%" v-else @click="goTo(visibleArray[2], 2)"></b-button>
      </b-col>
      <b-col>
        <b-button style="border-radius: 100%" variant="success" v-if="visibleArray[3].success==true" @click="goTo(visibleArray[3], 3)"></b-button>
        <b-button style="border-radius: 100%" v-else @click="goTo(visibleArray[3], 3)"></b-button>
      </b-col>
      <b-col>
        <b-button style="border-radius: 100%" variant="success" v-if="visibleArray[4].success==true" @click="goTo(visibleArray[4], 4)"></b-button>
        <b-button style="border-radius: 100%" v-else @click="goTo(visibleArray[4], 4)"></b-button>
      </b-col>
      <b-col cols="3"></b-col>
    </b-row>
    <div v-if="visibleArray[0].show">
      <div class="mt-5">
        <TheInfoFile />
      </div>
      <div class="mt-5">
        <b-button variant="primary" style="float: right" @click="next">weiter</b-button>
      </div>
    </div>
    <div v-if="visibleArray[1].show">
      <div class="mt-5">
        <TheLeftForm />
      </div>
      <div class="mt-5">
        <b-button variant="danger" style="float: left" @click="prev">zurück</b-button>
      </div>
      <div class="mt-5">
        <b-button variant="primary" style="float: right" @click="next">weiter</b-button>
      </div>
    </div>
    <div v-if="visibleArray[2].show">
      <div class="mt-5">
        <TheBackForm />
      </div>
      <div class="mt-5">
        <b-button variant="danger" style="float: left" @click="prev">zurück</b-button>
      </div>
      <div class="mt-5">
        <b-button variant="primary" style="float: right" @click="next">weiter</b-button>
      </div>
    </div>
    <div v-if="visibleArray[3].show">
      <div class="mt-5">
        <TheRightForm />
      </div>
      <div class="mt-5">
        <b-button variant="danger" style="float: left" @click="prev">zurück</b-button>
      </div>
      <div class="mt-5">
        <b-button variant="primary" style="float: right" @click="next">weiter</b-button>
      </div>
    </div>
    <div v-if="visibleArray[4].show">
      <div class="mt-5">
        <TheTopForm />
      </div>
      <div class="mt-5">
        <b-button variant="danger" style="float: left" @click="prev">zurück</b-button>
      </div>
      <div class="mt-5">
        <b-button variant="primary" style="float: right" @click="next">weiter</b-button>
      </div>
    </div>
    <div class="mt-5" v-if="!visibleArray[0].show && !visibleArray[1].show && !visibleArray[2].show && !visibleArray[3].show && !visibleArray[4].show">Super dein Auto ist jezt bei uns hinterlegt</div>
  </div>
</template>

<script>
import TheInfoFile from './TheInfoFile.vue';
import TheLeftForm from './TheLeftForm.vue';
import TheRightForm from './TheRightForm.vue';
import TheTopForm from './TheTopForm.vue';
import TheBackForm from './TheBackForm.vue';
export default {
  components: {
    TheLeftForm,
    TheInfoFile,
    TheRightForm,
    TheBackForm,
    TheTopForm,
  },
  data() {
    return {
      visibleArray: [
        {id: 'info', success: false, show: true},
        {id: 'links', success: false, show: false},
        {id: 'hinten', success: false, show: false},
        {id: 'rechts', success: false, show: false},
        {id: 'oben', success: false, show: false},
      ],
      count: 0,
    };
  },
  methods: {
    goTo(i, count) {
      for(let j = 0; j < this.visibleArray.length; j++) {
        this.visibleArray[j].show = false;
        this.visibleArray[j].success = false;
      }
      for(let x = 0; x < count; x++) {
        this.visibleArray[x].success =true
      }
      i.show = true;
      i.success = false;
      this.count = count;
    },
    next() {
      for(let j = 0; j < this.visibleArray.length; j++) {
        this.visibleArray[j].show = false;
      }
      this.visibleArray[this.count].success= true;
      this.count++;
      this.visibleArray[this.count].show = true;
    },
    prev() {
      for(let j = 0; j < this.visibleArray.length; j++) {
        this.visibleArray[j].show = false;
      }
      this.visibleArray[this.count].success= false;
      this.count--;
      this.visibleArray[this.count].show = true;
    }
  }
}
</script>
<style scoped>
.frame {
  padding-top: 180px;
  padding-bottom: 60px;
  margin-left: 10%;
  margin-right: 10%;
}
.startHeader {
  text-align: center;
  margin-bottom: 1%;
}
.blockText{
  text-align: center;
  margin-bottom: 5%;
}
</style>
