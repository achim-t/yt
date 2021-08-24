<template><p></p></template>
<script>
import axios from "axios";

export default {
  async created() {
    await this.getChannels();
    // await this.getVideos("UCxthdj6BtozwYyvhKa4cgSQ");
    // for (const channel of this.channels) {
    //await this.getVideos(this.channels[0]);
    // }
    // await this.testGetVideo("UC0intLFzLaudFG-xAvUEO-A");
  },
  methods: {
    async getChannelDetails(ids) {
      const params = {
        part: "contentDetails",
        id: ids,
        fields: "items(id,contentDetails/relatedPlaylists/uploads)",
        key: localStorage.API_KEY,
      };

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        { params }
      );
      
      for (const item of response.data.items) {
        const channel = await this.$pouch.get(item.id)
        channel.playlistId =
          item.contentDetails.relatedPlaylists.uploads;
        await this.$pouch.put(channel)
      }
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
        key: localStorage.API_KEY,
      };
      const channels = [];
      do {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/subscriptions",
          {
            params: this.removeEmptyParams(params),
          }
        );
        const items = response.data.items;
        params.pageToken = response.data.nextPageToken;

        const currChannels = items.map((item) => {
          let channel = {
            ...item.snippet,
            ...item.snippet.resourceId,
            thumbnail: item.snippet.thumbnails.medium.url,
          };
          delete channel.thumbnails;
          delete channel.resourceId;
          channel._id = channel.channelId;
          channel.sortTitle = channel.title.toUpperCase();
          return channel;
        });
        channels.push(...currChannels);
      } while (typeof params.pageToken !== "undefined");
      // eslint-disable-next-line no-unused-vars
      const responses = await Promise.all(
        channels.map((channel) =>{
          this.$pouch.get(channel._id).catch(() => this.$pouch.put(channel))
          }
        )
      );
      // eslint-disable-next-line no-debugger
      debugger
      /*if (responses) {
      const channelIds = responses.map((response) => response.id);
      const batchedChannelIds = [];
      while (channelIds.length)
        batchedChannelIds.push(channelIds.splice(0, 50).join(","));
      await Promise.all(
        batchedChannelIds.map((ids) => this.getChannelDetails(ids))
      );}*/
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
      const { duration, viewCount } = await this.getVideoDetailsFromId(id);
      video = {
        ...video,
        duration,
        viewCount,
      };
      return video;
    },
    async testGetVideo(channelId) {
      const result = await this.$pouch.find({
        selector: { channelId: { $eq: channelId }, kind: "youtube#channel" },
      });
      const channel = result.docs[0];
      await this.getVideos(channel);
    },
    async getVideoDetailsFromId(id) {
      const params = {
        part: "statistics,contentDetails",
        id,
        fields: "items(contentDetails/duration,statistics/viewCount)",
        key: localStorage.API_KEY,
      };
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: this.removeEmptyParams(params),
        }
      );
      const duration = response.data.items[0].contentDetails.duration;
      const viewCount = response.data.items[0].statistics.viewCount;
      return { duration, viewCount };
    },
    async getVideos(channel) {
      const { playlistId, etag } = channel;
      const params = {
        part: "snippet,contentDetails",
        playlistId,
        pageToken: "",
        key: localStorage.API_KEY,
        fields:
          "etag,items(snippet(channelId,channelTitle,publishedAt,title,description,thumbnails/medium/url,resourceId),contentDetails/videoPublishedAt)",
      };
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: this.removeEmptyParams(params),
          validateStatus: (status) => {
            return status < 500;
          },
          headers: {
            "If-None-Match": etag, //TODO:
          },
        }
      );
      if (response.status == 304) return;

      for (const item of response.data.items) {
        let video = {
          _id: item.snippet.resourceId.videoId,
          kind: item.snippet.resourceId.kind,
          ...item.snippet,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.contentDetails.videoPublishedAt,
        };
        delete video.thumbnails;
        delete video.resourceId;
        video = await this.getVideoDetails(video);
        this.$pouch.get(video._id).catch(() => this.$pouch.put(video));
        // if (!channel.lastVideoDate) {
        //   channel.lastVideoDate = video.publishedAt;
        //   this.$pouch.put(channel).then(res => {
        //     channel._rev = res._rev;
        //   });
        // }
      }
      channel.etag = response.data.etag;
      await this.$pouch.put(channel);
    },
  },
  pouch: {
    channels() {
      return {
        database: "yt_pouch",
        selector: { kind: "youtube#channel" },
      };
    },
  },
};
</script>