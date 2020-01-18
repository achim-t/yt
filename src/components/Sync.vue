<script>
import axios from "axios";

export default {
  // async mounted() {
  //   // this.getVideos("UCu17Sme-KE87ca9OTzP0p7g");
  //   await this.getChannels();
  //   for (const channel of this.channels) {
  //     this.getVideos(channel);
  //   }
  // },
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
    const channelId = "UCxthdj6BtozwYyvhKa4cgSQ";
    let params = {
      part: "snippet",
      channelId,
      fields:
        "kind,nextPageToken,items(snippet(resourceId,title,description,thumbnails/medium))",
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
        const channel = {
          ...item.snippet,
          ...item.snippet.resourceId,
          thumbnail: item.snippet.thumbnails.medium.url
        };
        delete channel.thumbnails;
        delete channel.resourceId;
        channel._id = channel.channelId;
        channel.sortTitle = channel.title.toUpperCase();
        this.$pouch.get(channel._id).catch(() =>
          this.$pouch.put(channel).then(res => {
            channel._rev = res._rev;
          })
        );
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
  async getVideos(channel) {
    const { channelId, lastVideoDate } = channel;
    const params = {
      // url: "search",
      part: "snippet",
      channelId,
      order: "date",
      pageToken: "",
      publishedAfter: lastVideoDate,
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
      if (!channel.lastVideoDate) {
        channel.lastVideoDate = video.publishAt;
        this.$pouch.put(channel).then(res => {
          channel._rev = res._rev;
        });
      }
      if (channel.lastVideoDate < video.publishAt) {
        channel.lastVideoDate = video.publishAt;
        this.$pouch.put(channel).then(res => {
          channel._rev = res._rev;
        });
      }
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
