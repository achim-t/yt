<template>
  <v-list-item link active>
    <v-list-item-avatar>
      <img v-if="channel.thumbnail" :src="channel.thumbnail">
    </v-list-item-avatar>
    <v-list-item-title v-text="channel.title"/>
    
  </v-list-item>
</template>

<script>
export default {
  props: ["channel", "active"]
}
</script>

