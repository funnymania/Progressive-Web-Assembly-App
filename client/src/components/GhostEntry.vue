<template>
  <div>
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
      allowSubmits
    };
  },
  props: {
    triggerAnim: false,
    ghostExit: false
  },
  watch: {
    triggerAnim(val) {
      this.allowSubmits = false;

      let popup = document.getElementById("cornCaption");
      let prefixes = ["webkit", "moz", "MS", "o", ""];

      let ghostCanal = document.getElementById("ghost-canal");
      let ghostAndCard = document.getElementById("ghost-and-card");

      for (let entry of prefixes) {
        ghostAndCard.addEventListener(
          entry + "animationend",
          this.animationEndListener
        );
      }

      // add class fadeopacity to black-bg
      ghostCanal.classList.add("fadeopacity-to-80");

      // add class scale-up to ghost-and-card
      ghostAndCard.classList.add("scale-up-while-bouncing");
    }
  },
  methods: {
    animationEndListener() {
      this.allowSubmits = true;
    }
  }
};
</script>

<style scoped>
#ghost-canal {
  background-color: rgba(0, 0, 0, 1);
  visibility: hidden;
}

.fadeopacity-to-80 {
  animation: fadeopacity-to-80-opactiy 3s;
}

.scale-up-while-bouncing {
  animation: scale-up-while-bouncing 3s;
}

#ghost-and-card {
}

#caring-ghost {
}

#id-card {
}

@keyframes fadeopacity-to-80 {
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
  from {
    transform: scale(0.6, 0.6);
  }
  to {
    transform: scale(1, 1);
  }
}
</style>
