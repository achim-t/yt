<template>
  <div class="channel-list">
    <ChannelListItem v-for="channel in channels" :channel="channel" :key="channel._id" />
  </div>
</template>

<script>
import ChannelListItem from "./ChannelListItem";

export default {
  components: { ChannelListItem },
  pouch: {
    channels() {
      return {
        database: "yt_pouch",
        selector: { kind: "youtube#channel" },
        sort: ["sortTitle"]
      };
    }
  }
};
</script>

<style>
.channel-list {
  width: 17rem;
  height: 100%;
  position: fixed;
  overflow: scroll;
  padding-bottom: 2em;
  margin-top: 60px;
}

.channel-list ::-webkit-scrollbar {
  width: 6px;
}
</style>