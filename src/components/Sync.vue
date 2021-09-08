<template><p></p></template>
<script>
import axios from "axios";

export default {
  created() {
    this.sync()
  },
  methods: {
    async sync(){
      await this.getChannels()
      const channels = await this.$pouch.find({
        selector: { kind: "youtube#channel" },
      })
      const videoIds = (await Promise.all(channels.docs.map(channel => this.getVideos(channel))))
      // eslint-disable-next-line no-debugger
      debugger
      const batchedVideoIds = []
      while (videoIds.length) batchedVideoIds.push(videoIds.splice(0, 50).join(","))
      await Promise.all(batchedVideoIds.map((ids) => this.getVideoDetailsFromId(ids)))
    },
    async getChannelDetails(ids) {
      const params = {
        part: "contentDetails",
        id: ids,
        fields: "items(kind,id,contentDetails/relatedPlaylists/uploads)",
        key: localStorage.API_KEY,
      };

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        { params }
      );
      
      for (const item of response.data.items) {
        const id = `${item.kind}#${item.id}`
        const channel = await this.$pouch.get(id)
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
          channel._id = `${channel.kind}#${channel.channelId}`;
          channel.sortTitle = channel.title.toUpperCase();
          return channel;
        });
        channels.push(...currChannels);
      } while (typeof params.pageToken !== "undefined");
      const responses = await this.$pouch.bulkDocs(channels)
      const channelIds = responses.filter((response) => response.ok).map(response => response.id.split('#')[2])
      if (channelIds.length) {
        const batchedChannelIds = [];
        while (channelIds.length)
          batchedChannelIds.push(channelIds.splice(0, 50).join(","));
        await Promise.all(
          batchedChannelIds.map((ids) => this.getChannelDetails(ids))
        );
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
    async getVideoDetailsFromId(id) {
      const params = {
        part: "statistics,contentDetails",
        id,
        fields: "items(kind,id,contentDetails/duration,statistics/viewCount)",
        key: localStorage.API_KEY,
      };
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: this.removeEmptyParams(params),
        }
      );
      for (const item of response.data.items) {
        const id = `${item.kind}#${item.id}`
        const video = await this.$pouch.get(id)
        video.duration = item.contentDetails.duration
        video.viewCount = item.statistics.viewCount
        await this.$pouch.put(video)
      }
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
      if (response.status == 304) return [];
      const videos = response.data.items.map((item) =>{
        let video = {
          videoId: item.snippet.resourceId.videoId,
          kind: item.snippet.resourceId.kind,
          ...item.snippet,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.contentDetails.videoPublishedAt,
        }
        video._id = `${video.kind}#${video.videoId}`
        delete video.thumbnails;
        delete video.resourceId;
        return video
      })
      channel.etag = response.data.etag;
      await this.$pouch.put(channel).catch(()=> {
        // eslint-disable-next-line no-console
        console.log("channel error: " + channel)
      });
      const responses = await this.$pouch.bulkDocs(videos).catch(() => {
        // eslint-disable-next-line no-console
        console.log(videos)
      })
      const videoIds = 
        responses
          .filter((response) => response.ok)
          .map(response => response.id)
      return videoIds
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