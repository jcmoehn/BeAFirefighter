<!-- <template>
  <div>
    <b-card>
      <b-card-header><h4>Infos über die linke Seite deines Autos</h4></b-card-header>
      <b-card>
        <b-form-group
        label="Bitte lade hier die linke Bild-Seite deines Autos hoch :"
        description="(Größe: 1024px X 480px, Dateigröße: maximal 300KB)"
        :disabled=!editorVisible
        class="mt-3"
      >
        <TheEditor @arrayValues="hitBoxen"  />
      </b-form-group>
      <b-form v-for="(i, index) in coords" :key="index">
        <hr>
        <b-form-group
          :label="`Bitte lade hier die linke Nah-Ansicht deiner ${index+1}. HitBox hoch:`"
          description="(Größe: 1024px X 480px, Dateigröße: maximal 300KB)"
          class="mt-3"
        >
          <TheEditor @arrayValues="zoomBoxen"/>
          <b-form v-for="(i,index) in zoomCoordsCounter" :key="index">
            <hr>
            <b-form-group
              :label="`Was soll sich in der ${index+1}. ZoomBox befinden:`"
              class="mt-3"
            >
              <b-form-select  :options="options"></b-form-select>
            </b-form-group>
          </b-form>
        </b-form-group>
      </b-form>
    </b-card>
    </b-card>
  </div>
</template>
  
  <script>
  import TheEditor from '@/components/TheEditor.vue'
  export default {
      components: {
          TheEditor,
      },
      data() {
          return {
              typeName: '',
              editorVisible: true,
              coords: [],
              coordsLength: 0,
              zoomCoordsLength: [],
              zoomCoordsCounter: 0,
              selected: null,
        options: [
          { value: null, text: 'Bitte wähle einen oder mehrere Gegenstände aus' },
          { value: 'a', text: 'Axt' },
          { value: 'b', text: 'Schlauch 5m' },
          { value: 'c', text: 'Leiter' },
          { value: 'd', text: 'Hammer'},
          { value: 'd', text: 'Pumpe'},
        ]
          };
      },
      methods: {
          hitBoxen(coords) {
              this.coordsLength = coords.length;
              this.coords = coords;
              this.editorVisible = false;
        },
        zoomBoxen(coords) {
          console.log("Coord length: " + coords.length);
          this.zoomCoordsLength[this.zoomCoordsCounter] = coords.length;
          this.zoomCoordsCounter++;
          console.log("ZoomBox Length: " + this.zoomCoordsLength[0]);
        }
      }
  }
  </script> -->

  <template>
    <div>
      <b-card>
        <b-card-header><h4>Infos über die linke Seite deines Autos</h4></b-card-header>
        <b-card>
          <b-form-group
          label="Bitte lade hier die linke Bild-Seite deines Autos hoch :"
          description="(Größe: 1024px X 480px, Dateigröße: maximal 300KB)"
          class="mt-3"
        >
          <TheEditor @arrayValues="hitBoxen"  />
        </b-form-group>
        <div v-if="zoom">
        <b-form v-for="(i, index1) in links[0].hitBoxen" :key="index1">
          <hr>
          <b-form-group
            :label="`Bitte lade hier die linke Nah-Ansicht deiner ${index1+1}. HitBox hoch:`"
            description="(Größe: 1024px X 480px, Dateigröße: maximal 300KB)"
            class="mt-3"
          >
            <TheEditor @arrayValues="zoomBoxen"/>
          </b-form-group>
        </b-form></div>
        <!-- <b-form v-for="(i,index) in realCoordsLength" :key="index">
          <hr>
          <b-form-group
            :label="`Was soll sich in der ${index+1}. ZoomBox befinden:`"
            class="mt-3"
          >
            <b-form-select  :options="options"></b-form-select>
          </b-form-group>
        </b-form>  -->
      </b-card>
      </b-card>
      {{links}}
    </div>
  </template>
    
    <script>
    import TheEditor from '@/components/TheEditor.vue'
    export default {
        components: {
            TheEditor,
        },
        data() {
            return {
              zoom: false,
              index: 0,
              links: [],
            };
        },
        methods: {
            hitBoxen(coords) {
              console.log(this.links)
              this.links=[
                {hitBoxen: coords},
                {zoom: []},
              ]
              this.zoom = true;
            },
          // eslint-disable-next-line
          zoomBoxen(coords) {
            this.links[1].zoom.push(coords)
            this.index++;
            console.log(this.links)
          },
        },
    }
  </script>

  