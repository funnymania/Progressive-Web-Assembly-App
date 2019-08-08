<template>
  <div id="flex-wart">
    <h3 style="padding-right:1em;">switch-art</h3>
    <div id="wart-cont">
      <div id="scroll">
        <br />
        <p>RETTY sure *NUMBER *NUMBER was the one..</p>
        <br />
        <p>we cloned a story in your lake of melancholica</p>
        <p>and dipped the paper myth in,</p>
        <p>*NUMBER was the one.</p>
        <p>shuddering from the icy bedsheets</p>
        <p>cid's theme whirs from a propellant aircraft</p>
        <p>what are we rolling for?</p>
      </div>
    </div>
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
