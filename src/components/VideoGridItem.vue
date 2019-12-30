<template>
  <a :href="`https://www.youtube.com/watch?v=${video.id}`">
    <div class="video-preview">
      <div class="image-container">
        <img :src="video.thumbnail" alt="video thumbnail" />
        <div class="time-label">
          <span>{{ video.duration }}</span>
        </div>
        <div class="mark-watched">
          <i class="check icon"></i>
        </div>
      </div>
      <div class="video-info">
        <div class="semi-bold show-max-two-lines" :title="video.title">
          {{ video.title }}
        </div>
        <div class="video-preview-metadata-container">
          <div class="channel-title">{{ video.channelTitle }}</div>
          <div class="view-and-time">
            {{ video.viewCount }} views • {{ publishedAt }}
          </div>
          <div class="show-max-two-lines">{{ video.description }}</div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
import { format } from 'timeago.js'

export default {
  props: ['video'],
  computed: {
    publishedAt() {
      return format(this.video.publishedAt)
    },
  },
}
</script>

<style>
.video-preview {
  display: grid;
  grid: 118px auto / 210px;
  text-align: left;
  margin-right: 4px;
  margin-bottom: 24px;
}

.image-container {
  position: relative;
  grid-row: 1 /2;
  grid-column: 1/2;
}

.image-container:hover .time-label {
  display: none;
}

.image-container:hover .mark-watched {
  display: inline;
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
  text-overflow: ellipsis;
}

.semi-bold {
  font-weight: 600;
}

img {
  max-width: 100%;
  max-height: 100%;
}

.mark-watched {
  position: absolute;
  display: none;
  color: white;
  background: black;
  bottom: 5px;
  right: 5px;
  cursor: pointer;
  padding: 2px;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  border-color: #333;
}
</style>
