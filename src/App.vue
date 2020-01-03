<template>
  <div id="app">
    <EnterApiKey />
    <VideoGrid />
  </div>
</template>

<script>
import EnterApiKey from './components/EnterApiKey'
import VideoGrid from './components/VideoGrid.vue'

export default {
  name: 'app',
  components: {
    VideoGrid,
    EnterApiKey,
  },
  mounted() {
    //this.loadYoutubeApi()
  },
  methods: {
    loadYoutubeApi() {
      if (!localStorage.API_KEY || localStorage.API_KEY === '') return
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/client.js'

      script.onload = () => {
        window.gapi.load('client', () => {
          window.gapi.client.setApiKey(localStorage.API_KEY)
          window.gapi.client.load('youtube', 'v3', () => {
            //this.props.youtubeLibraryLoaded()
          })
        })
      }

      document.body.appendChild(script)
    },
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
