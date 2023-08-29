<!-- Author: Jannik Weiß, Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
  <div>
    <b-card>
      <b-card-header>
        <b-row>
        <b-col><h4>Infos über die hintere Seite deines Autos</h4></b-col>
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
      <b-card>

        <!-- Editor zum Hochladen des Bildes der hinteren Außenseite -->
        <b-form-group
          label="Bitte lade hier die hintere Bild-Seite deines Autos hoch :"
          description="(Bidlformat: 'JPEG', Dateigröße: maximal 200KB, Idealformat: 1024 x 480)"
          class="mt-3"
        >
        <TheEditor ref="editor" @arrayValues="hitBoxen"  @image="getFrontImage" :aussenWidth="''" :aussenHeight="''" @aussenEmit="aussenEmit"/>
        
        <!-- Editor(en) zum Hochladen der HitBox(en) -->
        </b-form-group>
        <div v-if="zoom">
          <b-form v-for="(i, indexZoom) in hinten.hitBoxen" :key="indexZoom">
            <hr class="hit">
            <b-form-group
              :label="`Bitte lade hier die hintere Nah-Ansicht deiner ${indexZoom+1}. HitBox hoch:`"
              description="(Größe: 1024px X 480px, Dateigröße: maximal 300KB)"
              class="mt-3"
            >
              <TheEditor @arrayValues="zoomBoxen" @image="getZoomImage" :aussenWidth="aussenWidth" :aussenHeight="aussenHeight"/>
              
              <!-- Editor(en) zum Hochladen der ZoomBox(en) -->
              <div>
                <b-form v-for="(i,indexTool) in hinten.zoomBoxen[indexZoom]" :key="indexTool">
                  <hr class="zoom">
                  <b-form-group
                    :label="`Was soll sich in der ${indexTool+1}. ZoomBox befinden:`"
                    class="mt-3"
                  >

                    <!-- Werkzeuge der Standardbeladung auswählen -->
                    <div>
                      <multiselect
                        :options="options"
                        :multiple="true"
                        :close-on-select="true"
                        :clear-on-select="false"
                        selectedLabel="Ausgewählt"
                        placeholder="Werkzeuge auswählen"
                        selectLabel="Enter drücken oder klicken, um dieses Werkzeug auszuwählen"
                        deselectLabel="Enter drücken oder klicken, um dieses Werkzeug zu entfernen"
                        v-model="tool[indexZoom][indexTool]"
                      >
                          <span slot="noResult">Werkzeug ist nicht Teil der Standardbeladung. Bitte manuell hinzufügen.</span>
                          <span slot="noOptions">Fehler beim Verbinden der Datenbank</span>
                      </multiselect>
                    </div>
                  </b-form-group>
                  <b-form-group
                    :label="`Werkzeug nicht gefunden? Selbst hinzufügen:`"
                    class="mt-3"
                  >

                    <!-- Sonderwerkzeuge hinzufügen -->
                    <div>
                      <multiselect
                        :taggable="true"
                        @tag="addExtraTag"
                        :options="extraOptions"
                        :multiple="true"
                        :id="`${indexZoom},${indexTool}`"
                        :close-on-select="true"
                        :clear-on-select="false"
                        selectedLabel="Ausgewählt"
                        placeholder="Eigene Werkzeuge hinzufügen"
                        tagPlaceholder="Enter drücken oder klicken, um neues Werkzeug hinzuzufügen"
                        selectLabel="Enter drücken oder klicken, um dieses Werkzeug auszuwählen"
                        deselectLabel="Enter drücken oder klicken, um dieses Werkzeug zu entfernen"
                        v-model="extraTool[indexZoom][indexTool]"
                      >
                          <span slot="noResult">Suche ergab keine Treffer</span>
                          <span slot="noOptions">Noch kein Werkzeug zur Auswahl hinzugefügt...</span>
                      </multiselect>
                    </div>
                  </b-form-group>
                </b-form>
              </div>
            </b-form-group>
          </b-form>
        </div>
      </b-card>
      <b-button variant="danger" style="float: right; margin-top: 10px;" @click="reset">Alles zurücksetzen</b-button>
    </b-card>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
  import TheEditor from '@/components/editor/jcrop/TheEditor.vue'
  import Multiselect from 'vue-multiselect'

  export default {
      components: {
          TheEditor,
          Multiselect,
      },
      data() {
          return {
            aussenWidth: 0,
            aussenHeight: 0,
            tool: [],
            extraTool: [],
            zoom: false,
            indexZoom: 0,
            indexTool: 0,
            extraToolHelpArray: [],
            hinten: {
              bild: null,
              hitBoxen: null,
              zoomImg: [],
              zoomBoxen: [],
              werkzeuge: null,
              sonderwerkzeuge: null,
            },
            extraOptions: [],
            options: []
          };
      },
      methods: {
        /* Resets the whole form */
        reset() {
          let tmp = this.options;
          /* Resets this data */
          Object.assign(this.$data,this.$options.data.call(this));
          /* Resets data in editor */
          this.$refs.editor.reset();
          this.options = tmp;

          /* Enables image upload */
          this.$refs.editor.$refs.uploadField.disabled = false;
          this.$refs.editor.$refs.clearButton.disabled = false;
          this.$refs.editor.$refs.uploadButton.disabled = false;
        },
        hitBoxen(coords) {
          this.hinten.hitBoxen = coords
          this.zoom = true;
        },
        getFrontImage(image){
          this.hinten.bild = image;
        },
        zoomBoxen(coords) {
          this.hinten.zoomBoxen.push(coords)
          this.tool.push([])
          this.extraTool.push([])
        },
        getZoomImage(image) {
          this.hinten.zoomImg.push(image)
        },
        saveAll() {
          this.hinten.werkzeuge = this.tool;
          this.hinten.sonderwerkzeuge = this.extraTool;
          console.log("TheBackForm.saveAll(): " + this.hinten);
          console.log(this.hinten);
          this.$emit('hinten', this.hinten);
        },
        aussenEmit(width, height) {
          console.log("Außen Width Emit: " + width);
          console.log("Außen Height Emit: " + height);
          this.aussenWidth = width;
          this.aussenHeight = height;
        },
        addExtraTag(newTag, id) {
          if (newTag == (null || '')) return;
          
          /* Only add to list when element isn't already part of the list */
          if (!this.extraOptions.some(element => {return element.toLowerCase() === newTag.toLowerCase();})) {
            this.extraOptions.push(newTag);
            this.extraOptions.sort(new Intl.Collator('de').compare); /* Activate this line to order alphabetically */

            /* Gets indexes */
            const idArray = id.split(",");
            this.indexZoom = idArray[0];
            this.indexTool = idArray[1];

            /* Adds new extra tool */
            if(this.extraTool[this.indexZoom][this.indexTool] == null) {
              this.extraTool[this.indexZoom][this.indexTool] = [newTag];
            }
            else {
              this.extraToolHelpArray.push(...this.extraTool[this.indexZoom][this.indexTool]);
              this.extraToolHelpArray.push(newTag);
              this.extraTool[this.indexZoom][this.indexTool] = this.extraToolHelpArray;
              this.extraToolHelpArray = [];
            }
            console.log(this.extraTool[this.indexZoom][this.indexTool]);

            this.$forceUpdate;
          }
          newTag = '';
        },
      },
      /* Gets a list of all standard tools */
      created() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'https://elwing.cs.hs-rm.de:3000/getallewerkzeuge', false);
        xmlHttp.send(null);
        
        let response = JSON.parse(xmlHttp.responseText);
        let toolNames = response.result.map(el => el.Geraetebezeichnung);
        toolNames.sort(new Intl.Collator('de').compare); /* Activate this line to order alphabetically */

        this.options = toolNames;
      },
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
  hr.hit {
    margin-top: 7%;
    margin-bottom: 7%;
    height:1px;
    border:none;
    color:#333;
    background-color:#333;
  }
  hr.zoom {
    margin-top: 3%;
    margin-bottom: 3%;
  }
</style>
