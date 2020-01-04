<template>
  <div id="app">
    <EnterApiKey />
    <ChannelList />
    <VideoGrid />
  </div>
</template>

<script>
import EnterApiKey from "./components/EnterApiKey";
import VideoGrid from "./components/VideoGrid.vue";
import ChannelList from "./components/ChannelList";
import axios from "axios";

export default {
  name: "app",
  components: {
    ChannelList,
    VideoGrid,
    EnterApiKey
  },
  mounted() {
    //this.loadYoutubeApi()
    this.getVideos("UCu17Sme-KE87ca9OTzP0p7g");
    this.getChannels();
  },
  methods: {
    loadYoutubeApi() {
      if (!localStorage.API_KEY || localStorage.API_KEY === "") return;
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/client.js";

      script.onload = () => {
        window.gapi.load("client", () => {
          window.gapi.client.setApiKey(localStorage.API_KEY);
          window.gapi.client.load("youtube", "v3", () => {
            //this.props.youtubeLibraryLoaded()
          });
        });
      };

      document.body.appendChild(script);
    },
    async getChannels() {
      const channelId = 'UCxthdj6BtozwYyvhKa4cgSQ'
      let params = {

        part: "snippet",
        channelId,
        maxResults: 50,
        fields: "kind,nextPageToken,items(snippet(resourceId,title,description,thumbnails/medium))",
        key: localStorage.API_KEY,

      };
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/subscriptions",
        {
          params: this.removeEmptyParams(params)
        }
      );
      for (const item of response.data.items) {
        const channel = {
          ...item.snippet,
          ...item.snippet.resourceId,
          thumbnail: item.snippet.thumbnails.medium.url,
        };
        delete channel.thumbnails;
        delete channel.resourceId;
        channel._id = channel.channelId;
        channel.sortTitle = channel.title.toUpperCase()
        this.$pouch.get(channel._id).catch(() => this.$pouch.put(channel));
      }



    },
    removeEmptyParams(params) {
      for (let p in params) {
        if (!params[p] || params[p] === "undefined") {
          delete params[p];
        }
      }
      return params;
    },
    async getVideos(channelId) {
      const params = {
        // url: "search",
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
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: this.removeEmptyParams(params)
        }
      );
      for (const item of response.data.items) {
        const video = {
          _id: item.id.videoId,
          kind: item.id.kind,
          ...item.snippet,
          thumbnail: item.snippet.thumbnails.medium.url
        };
        delete video.thumbnails;
        this.$pouch.get(video._id).catch(() => this.$pouch.put(video));
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
