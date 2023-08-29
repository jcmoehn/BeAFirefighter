<!-- Author: Jannik Weiß -->
<!-------- HTML -------->
<template>
  <div>
    <b-card>
      <b-card-header><h5>Zeichne hier bitte alle deine HitBoxen ein</h5></b-card-header>
      <Jcrop
        id="jcrop"
        :src=currentImage
        @update="sel = $event.sel"
        :options="options"
      />
      <b-button variant="primary" @click="getMulti" class="mt-3" style="float: right">Fertig</b-button>
      <b-button variant="danger" @click="removeRect" class="mt-3" style="float: right; margin-right: 5px">Hitboxen zurücksetzen</b-button>
    </b-card>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
  import { Jcrop } from 'vue-jcrop';
  
  export default {
    components: { Jcrop },
    props: ['valueImg', 'aussenWidth', 'aussenHeight'],
    data: () => ({
      options: { 
        multi:true,
      },
      sel: { },
      src: '',
      coords: [[]],
      rectCount: 0,
    }),
    methods: {
        /* Gets all coordinates and sends them to parent component */
        getMulti: function() {
          this.coords = [[]];
          var rects_init = this.$el.querySelectorAll(".jcrop-widget");
          var rects = [];
          var arr;
          var left, top, width, height;

          /* Removes all rects that are too small */
          for (let i = 0; i < rects_init.length; i++) {
            width = rects_init[i].style.width.replace('px','');
            height = rects_init[i].style.height.replace('px','');

            if((width < 10) || (height < 10)) {
              rects_init[i].parentNode.removeChild(rects_init[i]);
              continue;
            }

            rects.push(rects_init[i]);
          }
          rects_init = [];

          /* Gets absolute width and absolute height of image to calculate percentages */
          var detailImage = this.$el.querySelector("img");

          /* Gets coordinates from rects */
          for (let i = 0; i < rects.length; i++) {
            let correction = this.aussenHeight/detailImage.height;

            if(this.aussenWidth != '' && this.aussenHeight != '') {
              console.log("ZoomBox:");
              left = ((Number(rects[i].style.left.replace('px','')) * 100) / (this.aussenWidth)) * correction;
              top = (Number((rects[i].style.top.replace('px','')) * 100)) / (detailImage.height);
              width = ((Number((rects[i].style.width.replace('px','')) * 100)) / (this.aussenWidth)) * correction;
              height = (Number((rects[i].style.height.replace('px','')) * 100)) / (detailImage.height);
            }
            else {
              console.log("HitBox:");
              left = (Number(rects[i].style.left.replace('px','')) * 100) / (detailImage.width);
              top = (Number((rects[i].style.top.replace('px','')) * 100)) / (detailImage.height);
              width = (Number((rects[i].style.width.replace('px','')) * 100)) / (detailImage.width);
              height = (Number((rects[i].style.height.replace('px','')) * 100)) / (detailImage.height);
            }

            /* Adds coordinates of current rect to coords array */
            arr = [left, top, width, height];
            console.log(arr);
            this.coords[this.rectCount] = arr;
            this.rectCount++;

            /* Adds number to rect in HTML */
            rects[i].innerHTML = this.rectCount;
            rects[i].classList.add("number");
          }

          if (rects.length == 0) {
            this.coords = [];
          }

          console.log("coords:");
          console.log(this.coords);
          console.log("coords.length: " + this.coords.length);


          /* SENDING DATA */

          /* Sends coords to parent component */
          this.$emit('arrayValues', this.coords)
          this.coords = [];

          /* Sends absolute width and height to parent component */
          this.$emit('aussenEmit', detailImage.width, detailImage.height);


          /* CLEAN-UP */

          /* Disables jcrop after pressing 'Fertig' */
          var jcrop_stage = this.$el.querySelector(".jcrop-stage");
          jcrop_stage.style.pointerEvents = "none";
          jcrop_stage.classList.add("background");

          /* Disables Buttons after pressing 'Fertig' */
          var buttons = this.$el.querySelectorAll("button");
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
          }

          /* Removes highlight of active rect after pressing 'Fertig' */
          var active_rect = this.$el.querySelector(".jcrop-widget.active");
          if(active_rect != null) {
            active_rect.style.border = '1px white dashed';
            active_rect.classList.remove('active');
          }

          /* Removes shadows after pressing 'Fertig' */
          this.$el.querySelector(".jcrop-shade.t").remove();
          this.$el.querySelector(".jcrop-shade.l").remove();
          this.$el.querySelector(".jcrop-shade.r").remove();
          this.$el.querySelector(".jcrop-shade.b").remove();

          /* Disables image upload after pressing 'Fertig' */
          this.$parent.$refs.uploadField.disabled = true;
          this.$parent.$refs.clearButton.disabled = true;
          
          /* Empties rects */
          rects = [];
          this.$forceUpdate;
        },
        /* Removes all rects in Jcrop */
        removeRect: function() {
          this.$el.querySelector(".jcrop-shade.t").remove();
          this.$el.querySelector(".jcrop-shade.l").remove();
          this.$el.querySelector(".jcrop-shade.r").remove();
          this.$el.querySelector(".jcrop-shade.b").remove();
          const rects = this.$el.querySelectorAll(".jcrop-widget");

          for (var i = (rects.length - 1) ; i >= 0; i--) {
              rects[i].parentNode.removeChild(rects[i]);
          }
        },      
    },
    computed: {
        currentImage() {
          /*eslint-disable*/
          this.$forceUpdate()
          this.src = this.valueImg
          return this.src
        },
    },
  }
</script>

<style>
  img {
    max-width: 100% !important;
  }

  .card {
    position: static !important;
  }

  .number {
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    vertical-align: middle !important;
    display: flex !important;
    font-size: 2.5vw;
    font-weight: bold;
    background: transparent !important;
    opacity: 1 !important;
    color: rgba(255, 255, 255, 1) !important;
  }

  .background {
    background: rgba(0, 0, 0, 0.5) !important;
  }
</style>
