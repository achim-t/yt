<template><p></p>
</template>
<script>
import axios from "axios";

export default {
  async created() {
    // await this.getChannels();
    // await this.getVideos("UCxthdj6BtozwYyvhKa4cgSQ");
    // for (const channel of this.channels) {
      //await this.getVideos(this.channels[0]);
    // }
    await this.testGetVideo("UC4YUKOBld2PoOLzk0YZ80lw")
  },
  methods: {
    async getChannelDetails(channel) {
      const channelId = channel._id;
      const params = {
        part: "contentDetails",
        id: channelId,
        fields: "items/contentDetails/relatedPlaylists/uploads",
        key: localStorage.API_KEY
      };

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        { params }
      );
      channel.playlistId =
        response.data.items[0].contentDetails.relatedPlaylists.uploads;
      return channel
    },
    async getChannels() {
      const channelId = "UCxthdj6BtozwYyvhKa4cgSQ";
      let params = {
        part: "snippet",
        mine: false,
        maxResults: 50,
        channelId,
        fields:
          "etag,nextPageToken,items(snippet(resourceId,title,description,thumbnails/medium/url))",
        key: localStorage.API_KEY
      };
      do {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/subscriptions",
          {
            params: this.removeEmptyParams(params)
          }
        );
        const items = response.data.items;
        params.pageToken = response.data.nextPageToken;

        for (const item of items) {
          let channel = {
            ...item.snippet,
            ...item.snippet.resourceId,
            thumbnail: item.snippet.thumbnails.medium.url
          };
          delete channel.thumbnails;
          delete channel.resourceId;
          channel._id = channel.channelId;
          channel.sortTitle = channel.title.toUpperCase();
          channel = await this.getChannelDetails(channel)
          this.$pouch.get(channel._id).catch(() => this.$pouch.put(channel));
        }
      } while (typeof params.pageToken !== "undefined");
    },
    removeEmptyParams(params) {
      for (let p in params) {
        if (!params[p] || params[p] === "undefined") {
          delete params[p];
        }
      }
      return params;
    },
    async getVideoDetails(video) {
      const id = video._id;
      const params = {
        part: "statistics,contentDetails",
        id,
        fields: "items(contentDetails/duration,statistics/viewCount)",
        key: localStorage.API_KEY
      };
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: this.removeEmptyParams(params)
        }
      );
      const duration = response.data.items[0].contentDetails.duration;
      const viewCount = response.data.items[0].statistics.viewCount;
      video = {
        ...video,
        duration,
        viewCount
      };
      return video;
    },
    async testGetVideo(channelId){
      const result = await this.$pouch.find({
        selector: {channelId: {$eq: channelId},kind: "youtube#channel"}
      })
      const channel = result.docs[0]
      await this.getVideos(channel)
    },
    async getVideos(channel) {
      const { playlistId, etag } = channel;
      const params = {
        part: "snippet,contentDetails",
        playlistId,
        pageToken: "",
        key: localStorage.API_KEY,
        fields:
        "etag,items(snippet(channelId,publishedAt,title,description,thumbnails/medium/url,resourceId),contentDetails/videoPublishedAt)"
      };
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: this.removeEmptyParams(params),
          validateStatus: (status) => {
            return status < 500
          },
          headers: {
            "If-None-Match": etag //TODO:
          }
        }
      );
      if (response.status == 304) return

      for (const item of response.data.items) {
        let video = {
          _id: item.snippet.resourceId.videoId,
          kind: item.snippet.resourceId.kind,
          ...item.snippet,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.contentDetails.videoPublishedAt
        };
        delete video.thumbnails;
        delete video.resourceId
        video = await this.getVideoDetails(video);
        this.$pouch.get(video._id).catch(() => this.$pouch.put(video));
        // if (!channel.lastVideoDate) {
        //   channel.lastVideoDate = video.publishedAt;
        //   this.$pouch.put(channel).then(res => {
        //     channel._rev = res._rev;
        //   });
        // }
      }
      channel.etag = response.data.etag
      await this.$pouch.put(channel)
    }
  },
  pouch: {
    channels() {
      return {
        database: "yt_pouch",
        selector: { kind: "youtube#channel" }
      };
    }
  }
};
</script>
