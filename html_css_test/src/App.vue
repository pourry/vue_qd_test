<template>
  <IndexVue />
  <axiosTest></axiosTest>
</template>

<script>
import IndexVue from './components/IndexVue.vue'
import axiosTest from './utils/AxiosUtils.vue'
export default {
  name: 'App',
  components: {
    IndexVue,
    axiosTest
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
