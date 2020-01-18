<template>
   <v-container>
    <!-- <input v-model="channelId" /> -->
      <VideoGridItem :video="video" v-for="video in videos" :key="video._id" />
   </v-container>
</template>

<script>
import VideoGridItem from "./VideoGridItem";

export default {

  props: ['channelId', 'showWatched'],
  components: { VideoGridItem },
  pouch: {
    videos() {
      const selector = { kind: "youtube#video" };
      if (!this.showWatched) { 
        selector["$not"] = {"$or": [{watched: true},{"$exists": "watched"} ]}
      }
      if (this.channelId) selector.channelId = this.channelId;
      return {
        database: 'yt_pouch',
        sort: [{ publishedAt: "desc" }],
        selector,
        limit: 100
      };
    }
  },
};
</script>

