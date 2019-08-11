<template>
  <div id="ghost-overlay">
    <div id="ghost-and-card">
      <div id="caring-ghost"></div>
      <div id="id-card"></div>
    </div>
    <span id="ghost-canal"></span>
    <span id="catch-anim"></span>
  </div>
</template>

<script>
export default {
  name: "GhostEntry",
  data() {
    return {
      allowSubmits: true
    };
  },
  props: {
    triggerAnim: false,
    ghostExit: false
  },
  watch: {
    triggerAnim(val) {
      console.log("anim triggered");
      this.allowSubmits = false;

      let prefixes = ["webkit", "moz", "MS", "o", ""];

      let ghostCanal = document.getElementById("ghost-canal");
      let ghostAndCard = document.getElementById("ghost-and-card");

      for (let entry of prefixes) {
        ghostAndCard.addEventListener(
          entry + "animationend",
          this.animationEndListener.bind(null, ghostAndCard, ghostCanal)
        );
      }
      // add class fade-opacity to black-bg
      ghostCanal.classList.add("fade-opacity-to-80");
      console.log("fade begins");

      // add class scale-up to ghost-and-card
      ghostAndCard.classList.add("fade-in-scaleXY-bounce");
    }
  },
  methods: {
    animationEndListener(ghostCard, ghostCanal) {
      console.log("anime over");
      this.allowSubmits = true;
      this.triggerAnim = false;
      ghostCard.classList.add("ghost-and-card-finished");
      ghostCard.classList.remove("fade-in-scaleXY-bounce");
      ghostCanal.classList.add("ghost-canal-finished");
      ghostCanal.classList.remove("fade-opacity-to-80");
    }
  }
};
</script>

<style scoped>
#ghost-overlay {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0%;
  z-index: 1000;
  pointer-events: none;
}
#ghost-canal.ghost-canal-finished {
  opacity: 0.8;
  visibility: visible;
}
#ghost-canal {
  background-color: rgb(0, 0, 0);
  height: 100%;
  width: 100%;
  visibility: hidden;
  z-index: 100000;
  opacity: 0;
  top: 0%;
  left: 0%;
  position: absolute;
}

.fade-in-scaleXY-bounce {
  animation: 2.5s fade-opacity-to-100, 2.5s scale-up-while-bouncing;
  animation-fill-mode: forwards;
}

.fade-opacity-to-80 {
  animation: 2.5s fade-opacity-to-80;
  animation-fill-mode: forwards;
}
#ghost-and-card.ghost-and-card-finished {
  transform: translate(-50%, -50%) scale(1, 1);
  opacity: 1;
  visibility: visible;
}
#ghost-and-card {
  width: 200px;
  height: 200px;
  background-color: red;
  visibility: hidden;
  z-index: 1000000;
  pointer-events: all;
  position: absolute;
  top: 50%;
  left: 50%;
}

#caring-ghost {
}

#id-card {
}

@keyframes fade-opacity-to-100 {
  0% {
    opacity: 0;
    visibility: visible;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
@keyframes fade-opacity-to-80 {
  from {
    opacity: 0;
    visibility: visible;
  }
  to {
    opacity: 0.8;
    visibility: visible;
  }
}

@keyframes scale-up-while-bouncing {
  0% {
    transform: translate(-50%, -50%) scale(0.6, 0.6);
  }
  50% {
    transform: translate(-50%, -40%) scale(0.8, 0.8);
  }
  100% {
    transform: translate(-50%, -50%) scale(1, 1);
  }
}
</style>
