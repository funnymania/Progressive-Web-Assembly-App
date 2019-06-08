<template>
  <div>
    <input
      class="search-field"
      type="text"
      name="title"
      placeholder="Enter desired job title here."
    >
    <Chexbox></Chexbox>
    <JobList></JobList>
  </div>
</template>

<script>
import Chexbox from "../components/Chexbox.vue";
import JobList from "../components/JobRes.vue";

export default {
  name: "Hirable",
  components: {
    Chexbox,
    JobList
  },
  data() {
    return {
      // TODO: Pick up from axios talking to backend.
      supportedList: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.search-field {
  background: black;
  color: white;
  padding: 0px 0px 8px;
  border: none;
  font-size: 28px;
  transition: box-shadow 0.2s ease 0s;
  outline: currentcolor none medium;
  &:not(:focus) {
    box-shadow: rgba(0, 251, 251, 0.3) 0px 1px;
  }
}
</style>
