<template>
  <div>
    <input v-model="channelId" />
    <div class="video-grid">
      <VideoGridItem :video="video" v-for="video in videos" :key="video._id" />
    </div>
  </div>
</template>

<script>
import VideoGridItem from "./VideoGridItem";

export default {
  data() {
    return {
      channelId: "",
    };
  },
  components: { VideoGridItem },
  pouch: {
    videos() {
      const selector = { kind: "youtube#video" };
      if (this.channelId) selector.channelId = this.channelId;
      return {
        database: 'yt_pouch',
        sort: [{ publishedAt: "desc" }],
        selector
      };
    }
  },
};
</script>

<style>
.video-grid {
  display: flex;
  flex-wrap: wrap;

  margin-left: 17rem;
  padding-left: 4px;
  margin-bottom: 24px;
}
</style>
