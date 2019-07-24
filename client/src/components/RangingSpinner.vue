<template>
  <div class="loader">
    <div v-bind:class="activeObject">
      <div class="outer"></div>
      <div class="inner"></div>
      <div class="middle"></div>
      <div>Ranging them 'corns!</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RangingSpinner",
  props: {
    activate: Boolean
  },
  computed: {
    activeObject() {
      return {
        inactive: !this.activate,
        active: this.activate
      };
    }
  }
};
</script>

<style>
.inactive {
  visibility: hidden;
}

.loader {
  position: relative;
  margin: 60 auto;
}

.active {
  visibility: visible;
}

.outer,
.middle,
.inner {
  border: 3px solid transparent;
  border-top-color: #3cefff;
  border-right-color: #3cefff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
}

.active.outer {
  width: 3.5em;
  height: 3.5em;
  margin-left: -1.75em;
  margin-top: -1.75em;
  animation: spin 2s linear infinite;
}

.active.middle {
  width: 2.1em;
  height: 2.1em;
  margin-left: -1.05em;
  margin-top: -1.05em;
  animation: spin 1.75s linear reverse infinite;
}

.active.inner {
  width: 0.8em;
  height: 0.8em;
  margin-left: -0.4em;
  margin-top: -0.4em;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
