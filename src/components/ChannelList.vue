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
        database: 'yt_pouch',
        selector: { kind: "youtube#channel" },
        sort: ['sortTitle']
      };
    }
    
    
  },
  // computed: {
  //   channels() {
  //     return this.yt_pouch;
  //   }
  // }

};
</script>

<style>
.channel-list {
  width: 17rem;
  position: fixed;
  overflow-y: auto;
}

.channel-list ::-webkit-scrollbar {
    width: 6px;
}
</style>