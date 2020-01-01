<template>
  <div v-if="!ApiKeyLoaded">
    <input v-model="API_KEY" />
    <button @click="persist">Save</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      API_KEY: '',
      ApiKeyLoaded: false,
    }
  },
  mounted() {
    if (localStorage.API_KEY) {
      this.API_KEY = localStorage.API_KEY
      this.ApiKeyLoaded = this.API_KEY !== ''
    }
  },
  methods: {
    persist() {
      if (!this.API_KEY) return
      localStorage.API_KEY = this.API_KEY
      this.ApiKeyLoaded = true
    },
  },
}
</script>

<style></style>
