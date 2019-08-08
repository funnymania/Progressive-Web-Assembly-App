<template>
  <div id="flex-wart">
    <h2 style="padding-right:1em;">Fear is the soul.</h2>
    <div id="wart-cont">
      <div id="scroll">
        <h3>The soul is the end of you.</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FearIsTheSoul"
};
</script>

<style>
#flex-wart {
  display: flex;
  flex-direction: column;
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

