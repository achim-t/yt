<template>
  <v-list dense>
    <v-list-item-group v-model="selected">
      <ChannelListItem
        v-for="(channel,i) in channels"
        :channel="channel"
        :key="i+1"
        @click.native="$emit('channelChanged',channel._id)"
      />
    </v-list-item-group>
  </v-list>
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
  },
  data() {
    return {
      dummyChannel: {
        _id: "",
        title: "All"
      },
      drawer: null,
      selected: undefined
    };
  }
};
</script>

