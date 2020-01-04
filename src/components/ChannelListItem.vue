<template>
  <div class="channel-list-item">
    <img :src="channel.thumbnail">
    {{channel.title}}
  </div>
</template>

<script>
export default {
  props: ["channel"]
}
</script>

<style>
.channel-list-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1em 1em;
  font-weight: 400;
}
.channel-list-item img {
  margin-right: 24px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
}
</style>