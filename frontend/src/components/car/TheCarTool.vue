<!-- Author: Emanuel Bisso, Jan-Christopher Möhn-->
<template>
  <div class="frame">
    <div>
      <!-- Zeigt die Werkzeuge an -->
      <div class="headline">
        <span>Werkzeuge</span>
      </div>
      <div>
        <b-container class="table" v-for="(i, index) in tools" :key="index" fluid>
          <b-row style="border: 0.1px solid black;">
            <b-col cols="4" class="frame">
              <span class="helper"><img id="img" :src="i" style="width: 20%; height:auto;"></span>
            </b-col>
            <b-col class="text-center">
                {{description[index]}}
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    props: ['Fahrzeugtyp', 'RaumID', 'KoordinatenID', 'Fachseite'],
    data() {
        return {
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Tools.svg/128px-Tools.svg.png?20070317115630',
        tools: [], // Alle Werkzeuge
        description: [],
        }
    },
    methods: {
    },
    created() {
        axios({
            //(Fahrzeugtyp,RaumID,Koordinatenid(vom Frontend zugeteilte ID des Fachs für das fahrzeug), Fachseite)
            method: 'GET',
            url: `https://elwing.cs.hs-rm.de:3000/getbestandsliste?Fahrzeugtyp=${this.Fahrzeugtyp}&RaumID=${this.RaumID}&KoordinatenID=${this.KoordinatenID}&Fachseite=${this.Fachseite}`,
        })
      .then((data) => {
        for(let i = 0; i < data.data.result.length; i++){
          if(data.data.result[i].Standardgeraet != null){
            this.tools.push(this.img)
            this.description.push(data.data.result[i].Standardgeraet)
          }
          if(data.data.result[i].Sondergeraet != null){
            this.tools.push(this.img)
            this.description.push(data.data.result[i].Sondergeraet)
          }
        }
      })
    },
}
</script>

<style scoped>

html, body {
    height: 100%;
    width: auto;
}

.headline {
    width: 100%; 
    text-align: center; 
    border-bottom: 1px solid #000; 
    line-height: 0.1em;
    margin: 10px 0 20px;
}

.headline span {
    background:#fff; 
    padding:10px; 
}

.headline hr {
    display: block;
    height: 6px;
    border: 0;
    border-top: 1px solid rgb(156, 11, 11);
    margin: 1em 0;
    padding: 0;
}

.frame {
    width: 200px;
}

.table span{
    position: relative;
    width: 100%;
}

#img {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: relative;
}

</style>