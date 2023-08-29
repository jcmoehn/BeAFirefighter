<template>
  <div>
    {{links}}
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
          <b-form v-for="(i, indexZoom) in links.hitBoxen" :key="indexZoom">
            <hr>
            <b-form-group
              :label="`Bitte lade hier die linke Nah-Ansicht deiner ${indexZoom+1}. HitBox hoch:`"
              description="(Größe: 1024px X 480px, Dateigröße: maximal 300KB)"
              class="mt-3"
            >
              <TheEditor @arrayValues="zoomBoxen"/>
              <div>
                <b-form v-for="(i,indexTool) in links.zoomBoxen[indexZoom]" :key="indexTool">
                  <hr>
                  <b-form-group
                    :label="`Was soll sich in der ${indexTool+1}. ZoomBox befinden:`"
                    class="mt-3"
                  >
                    <div>
                      <b-form-select  multiple :options="options" v-model="tool[indexZoom][indexTool]"></b-form-select>
                    </div>
                  </b-form-group>
                </b-form>
              </div>
            </b-form-group>
          </b-form>
        </div>
      </b-card>
    </b-card>
    <b-button @click="saveAll">Speichern</b-button>
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
            tool:[],
            zoom: false,
            links: {
              bild: 'image.jpg',
              hitBoxen: null,
              zoomBoxen: [],
              werkzeuge: null,
            },
            options: [
          { value: 'a', text: 'Axt' },
          { value: 'b', text: 'Schlauch 5m' },
          { value: 'c', text: 'Leiter' },
          { value: 'd', text: 'Hammer'},
          { value: 'e', text: 'Pumpe'},
          { value: 'f', text: 'X'}
        ]
          };
      },
      methods: {
          hitBoxen(coords) {
            this.links.hitBoxen = coords
            this.zoom = true;
          },
        zoomBoxen(coords) {
          this.links.zoomBoxen.push(coords)
          this.tool.push([])
        },
        saveAll() {
          this.links.werkzeuge = this.tool
          console.log(this.links)
        }
      },
  }
</script>