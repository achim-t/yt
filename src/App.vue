<template>
  <div id="app">
    <VideoGrid />
  </div>
</template>

<script>
import VideoGrid from './components/VideoGrid.vue'

export default {
  name: 'app',
  components: {
    VideoGrid,
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
