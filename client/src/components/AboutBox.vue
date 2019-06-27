<template>
<div>
  <About></About>
  <button @click="self.close()">OK</button>
</div>
</template>

<script>
import { About } from "../views/About.vue";
export default {
  name: "AboutBox",
  components: About
};
</script>

<style>
</style>
