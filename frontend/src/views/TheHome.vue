<!-- Author: Jan-Christopher Möhn -->
<!-- Erste Verison mit Emanuel Bisso erstellt-->
<!-------- HTML -------->
<template>
  <div>
    <TheStartContentDark/>
  </div>
</template>

<!-------- JAVASCRIPT -------->
<script>
import TheStartContentDark from '@/components/home/TheStartContentDark.vue'
export default{
  components: { // Eingebundene Kinder-Komponenten
    TheStartContentDark,
  },
}
</script>