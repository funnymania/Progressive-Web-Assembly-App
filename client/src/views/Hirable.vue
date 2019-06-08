<template>
  <div>
    <input type="text" name="title">
    <Chexbox></Chexbox>
    <JobList></JobList>
  </div>
</template>

<script>
import Chexbox from "../components/Chexbox.vue";
import JobList from "../components/JobRes.vue";

export default {
  name: "hirable",
  components: {
    Chexbox,
    JobList
  }
};
</script>

<style lang="scss" scoped>
</style>
