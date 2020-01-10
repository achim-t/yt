<template>
   <v-container>
    <!-- <input v-model="channelId" /> -->
      <VideoGridItem :video="video" v-for="video in videos" :key="video._id" />
   </v-container>
</template>

<script>
import VideoGridItem from "./VideoGridItem";

export default {

  props: ['channelId'],
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

