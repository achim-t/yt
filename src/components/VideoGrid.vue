<template>
  <div class="video-grid">
    <VideoGridItem :video="video" v-for="video in sorted" :key="video._id" />
  </div>
</template>

<script>
import VideoGridItem from "./VideoGridItem";
import axios from "axios";

export default {
  data() {
    return {
      videos: []
    };
  },
  components: { VideoGridItem },
  mounted() {
    // this.getVideos("UCouyFdE9-Lrjo3M_2idKq1A");
  },
  pouch: {
    videos: {}
  },
  methods: {
    getVideos(channelId) {
      const removeEmptyParams = params => {
        for (let p in params) {
          if (!params[p] || params[p] === "undefined") {
            delete params[p];
          }
        }
        return params;
      };

      const params = {
        url: "search",
        part: "snippet",
        channelId,
        order: "date",
        pageToken: "",
        publishedAfter: "",
        type: "video",
        key: localStorage.API_KEY,
        fields:
          "kind,nextPageToken,items(id,snippet(channelId,channelTitle,publishedAt,title,description,thumbnails/medium))"
      };
      axios
        .get("https://www.googleapis.com/youtube/v3/search", {
          params: removeEmptyParams(params)
        })
        .then(
          res =>
            (this.videos = res.data.items.forEach(item => {
              const video = {
                _id: item.id.videoId,
                ...item.snippet,
                thumbnail: item.snippet.thumbnails.medium.url
              };

              this.$pouch.put(video)
              
            }))
        );
    }
  },
  computed: {
    sorted() {
      return [...this.videos].sort((a, b)=>a.publishedAt < b.publishedAt?1:-1)
    }
  }
};
</script>

<style>
.video-grid {
  display: flex;
  flex-wrap: wrap;

  margin-left: 4px;
  margin-bottom: 24px;
}
</style>
