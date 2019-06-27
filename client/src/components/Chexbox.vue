<template>
  <div id="chex-grid">
    <div v-for="entry in supportedGroups" :key="entry.id">
      <div
        class="chex-child"
        @click="entry.isSelected = !entry.isSelected"
        :class="{ 'selected': entry.isSelected }"
      >{{ entry.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chexbox",
  props: {
    supportedGroups: Array
  },
  methods: {},
  created() {},
  data() {
    return {};
  }
};
</script>

<style lang="scss">
#chex-grid {
  justify-content: center;
  justify-items: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 40px;
  gap: 40px;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  width: 25%;
}

.chex-child {
  padding: 16px;
  border-bottom-left-radius: 10%;
  border-top-right-radius: 10%;
  border-top-left-radius: 2%;
  background-color: black;
  color: white;
  border: 1px dashed white;
  cursor: pointer;
}

.selected {
  color: black;
  background-color: white;
  border: none;
}
</style>
