<template>
  <v-app>
    <Sync />
    <EnterApiKey />
    <v-navigation-drawer v-model="drawer" app clipped>
      <template v-slot:prepend>
        <v-subheader link @click="channelChanged('')">SUBSCRIPTIONS</v-subheader>
      </template>
      <ChannelList @channelChanged="channelChanged" />
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="red" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-icon class="mx-4">mdi-youtube</v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">YoutubeGrid</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <VideoGrid :channelId="currentChannel" />
    </v-content>
  </v-app>
</template>

<script>
import EnterApiKey from "./components/EnterApiKey";
import VideoGrid from "./components/VideoGrid.vue";
import ChannelList from "./components/ChannelList";
import Sync from "./components/Sync";

export default {
  name: "App",

  components: {
    ChannelList,
    VideoGrid,
    EnterApiKey,
    Sync
  },
  data: () => ({
    drawer: null,
    currentChannel: ""
  }),
  methods: {
    channelChanged(channelId) {
      this.currentChannel = channelId;
    },
  },
};
</script>
