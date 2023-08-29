<template>
<div class="scroll_example">
     <nav class="scroll_nav">
         <a href="#section_1">1</a>
         <a href="#section_2">2</a>
         <a href="#section_3">3</a>
     </nav>
     <div class="scroll_cnt">
         <div id="section_1">1</div>
         <div id="section_2">2</div>
         <div id="section_3">3</div>
     </div>
 </div>
</template>

<style scoped>


.scroll_example {
  background: #191819;
  overflow: hidden;
}

.scroll_cnt {
    display: block;
    color: #fff;
    width: 100%;
    height: 150px;
    overflow-y: scroll;
    scroll-behavior: smooth;
}
</style>