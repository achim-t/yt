
<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      width="210px"
      flat
      :class="{ watched: video.watched }"
      class="d-inline-block mr-2"
      :key="componentKey"
    >
      <a :href="url" target="_blank" @click="setWatched(true)">
        <v-img :src="video.thumbnail">
          <v-card-title>
            <v-row class="fill-height flex-column">
              <div class="align-self-end">
                <v-btn
                  icon
                  @click.prevent.stop="toggleWatched"
                  :title="
                    video.watched ? 'mark as unwatched' : 'mark as watched'
                  "
                >
                  <v-icon :class="{ 'show-btns': hover }" :color="transparent"
                    >mdi-check</v-icon
                  >
                </v-btn>
              </div>
            </v-row>
            <div class="time-label" :class="{ hidden: hover }">
              <span>{{ duration }}</span>
            </div>
          </v-card-title>
        </v-img>
      </a>
      <v-card-subtitle>
        <div class="video-info">
          <div
            class="semi-bold show-max-two-lines"
            v-html="video.title"
            :title="unescape(video.title)"
          ></div>
          <div class="video-preview-metadata-container">
            <div class="channel-title">{{ video.channelTitle }}</div>
            <div class="view-and-time">
              {{ viewCount }} views • {{ publishedAt }}
            </div>
          </div>
        </div>
      </v-card-subtitle>
    </v-card>
  </v-hover>
</template>

<script>
import { format } from "timeago.js";
import ytDurationFormat from "youtube-duration-format";

export default {
  props: ["video"],
  computed: {
    publishedAt() {
      return format(this.video.publishedAt);
    },
    duration() {
      if (!this.video.duration) return ""
      return ytDurationFormat(this.video.duration);
    },
    viewCount() {
      const number = this.video.viewCount
      const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
      const tier = (Math.log10(Math.abs(number)) / 3) | 0;

      // if zero, we don't need a suffix
      if (tier == 0) return number;

      // get suffix and determine scale
      const suffix = SI_SYMBOL[tier];
      const scale = Math.pow(10, tier * 3);

      // scale the number
      const scaled = number / scale;

      // format number and add suffix
      return scaled.toFixed(1) + suffix;
    },
    url() {
      return `https://www.youtube.com/watch?v=${this.video._id}`;
    },
  },
  methods: {
    unescape(str) {
      const textArea = document.createElement("textarea");
      textArea.innerHTML = str;
      return textArea.value;
    },
    setWatched(watchedState) {
      this.video.watched = watchedState;
      this.$pouch.put(this.video).then((res) => (this.video._rev = res._rev));
      this.componentKey += 1;
    },
    toggleWatched() {
      this.setWatched(!this.video.watched);
    },
  },
  data: () => ({
    transparent: "rgba(255, 255, 255, 0)",
    componentKey: 0,
  }),
};
</script>
<style scoped>
.v-card.watched {
  opacity: 0.2;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
  background: black;
}

.hidden {
  display: none;
}

.time-label {
  position: absolute;
  background: #111111;
  bottom: 0;
  right: 0;
  opacity: 0.8;
  border-radius: 2px;
  font-weight: 500;
  color: white;
  margin: 4px;
  padding: 2px 4px;
  line-height: 12px;
}
.channel-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-and-time {
  margin-bottom: 10px;
}

.video-preview-metadata-container {
  padding-top: 5px;
  font-size: 13px;
  color: #6e6e6e;
}
.video-info {
  color: #626262;
}
.show-max-two-lines {
  overflow: hidden;
  line-height: 1.4em;
  max-height: 2.8em;
  min-height: 2.8em;
  text-overflow: ellipsis;
}

.semi-bold {
  font-weight: 600;
}
</style>
