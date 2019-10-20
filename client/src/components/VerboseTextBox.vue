<template>
  <span id="verbose-text-box">
    <h2>{{ title }}</h2>
    <span class="verbose-text">
      <span v-html="content"></span>
    </span>
  </span>
</template>

<script>
export default {
  name: "VerboseTextBox",
  props: {
    title: String,
    display: Boolean,
    content: String
  },
  watch: {
    display(val) {
      let modal = document.getElementById("verbose-text-box");
      modal.classList.toggle("show-modal");
    }
  }
};
</script>

<style>
#verbose-text-box {
  visibility: hidden;
  opacity: 0;
  overflow-y: auto;
  max-height: 90%;
  min-width: 312px;
  margin: 0 auto;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 1);
  color: white;
  border: skyblue 6px solid;
  top: 50%;
  position: absolute;
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s;
  padding: 0 10px 20px;
}
#verbose-text-box.show-modal {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity 0.25s 0s;
}
</style>