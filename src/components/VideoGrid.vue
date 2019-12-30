<template>
  <div class="video-grid">
    <VideoGridItem :video="video" v-for="video in videos" :key="video.id" />
  </div>
</template>

<script>
import VideoGridItem from './VideoGridItem'
import videosjson from './videos.json'

export default {
  data() {
    return {
      videos: {},
    }
  },
  components: { VideoGridItem },
  mounted() {
    this.videos = videosjson
  },
}
</script>

<style>
.video-grid {
  display: flex;
  flex-wrap: wrap;

  margin-left: 4px;
  margin-bottom: 24px;
}
</style>
