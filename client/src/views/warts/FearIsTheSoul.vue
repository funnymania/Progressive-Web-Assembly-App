<template>
  <div id="flex-wart">
    <h2 style="padding-right:1em;">Fear is the soul.</h2>
  </div>
</template>

<script>
export default {
  name: "Switch-Art"
};
</script>

<style>
#flex-wart {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
#wart-cont {
  height: 120px;
  overflow-y: hidden;
}
#scroll {
  animation: 20s scroll-down;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 3.5s;
}
@keyframes scroll-down {
  0% {
    margin-top: 0em;
  }
  100% {
    margin-top: -15em;
  }
}
</style>

