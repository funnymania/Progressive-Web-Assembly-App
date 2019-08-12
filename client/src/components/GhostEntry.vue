<template>
  <div id="ghost-overlay">
    <div id="ghost-and-card">
      <div id="caring-ghost">
        <div class="ghost-eye-left"></div>
        <div class="ghost-eye-right"></div>
        <div id="ghost-body"></div>
        <div id="ghost-arm-left"></div>
        <div id="ghost-arm-right"></div>
      </div>
      <div id="id-card">
        <p>Life is looking ...</p>
        <label>U</label>
        <input
          type="text"
          name="ghost-email"
          placeholder="Email address here."
          autocomplete="on"
          @keyup.enter="validateForm"
        />
        <br />
        <label>p</label>
        <input
          type="text"
          name="ghost-pass"
          placeholder="Ghost pass here."
          autocomplete="on"
          @keyup.enter="validateForm"
        />
        <br />
        <div id="button-row">
          <div>
            <span class="id-button" @click="forgotPass">Forgot Ghost Pass.</span>
            <br />
            <span class="id-button" @click="becomeGhost">Become a Ghost.</span>
          </div>
          <span class="id-button" @click="phaseIn">Phase on in!</span>
        </div>
      </div>
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
    phaseIn() {
      // Grab values of input.
      // Validate.
      // Pass to server, on positive response sign user in.
    },
    becomeGhost() {
      // Grab values of input.
      // Validate.
      // Pass to server, on positive response sign user in.
    },
    forgotPass(e) {
      // Animation of ghost moving card aside to new one.
      this.ghostSwitchCard(e.target);
    },
    ghostSwitchCard(e) {
      if (e.innerHTML == "Forgot Ghost Pass.") {
        // Flip card.
        // Hide current fields, replace with email field.
      } else if (e.innerHTML == "Become a Ghost.") {
        // Flip card.
        // Hide current fields, replace with sign up fields.
      }
    },
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
input {
  background: inherit;
  color: white;
  padding: 0px 0px 6px;
  margin: 0 1em;
  border: none;
  font-size: 1em;
  transition: box-shadow 0.2s ease 0s;
  outline: currentcolor none medium;
}

input:not(:focus) {
  box-shadow: rgba(0, 251, 251, 0.3) 0px 1px;
}
::placeholder {
  color: slategray;
  text-align: center;
}

.id-button {
  border: white 1px solid;
  cursor: pointer;
  font-weight: 600;
  display: block;
  box-shadow: 0px 0px 40px;
  padding: 3px 5px;
}
.id-button:hover {
  color: darkmagenta;
  border-color: lightgrey;
  box-shadow: 0px 0px 60px;
}

#button-row {
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  padding-top: 10px;
  align-items: baseline;
}
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
  animation: 2s fade-opacity-to-100, 2s scale-up-while-bouncing;
  animation-fill-mode: forwards;
}

.fade-opacity-to-80 {
  animation: 2s fade-opacity-to-80;
  animation-fill-mode: forwards;
}
#ghost-and-card.ghost-and-card-finished {
  transform: translate(-50%, -50%) scale(1, 1);
  opacity: 1;
  visibility: visible;
}
#ghost-and-card {
  width: 70%;
  min-height: 250px;
  background-color: tan;
  visibility: hidden;
  z-index: 1000000;
  pointer-events: all;
  position: absolute;
  top: 50%;
  left: 50%;
}

#caring-ghost {
  top: 170px;
  left: 50%;
  transform: translate(-50%, 0);
  position: absolute;
  width: 400px;
}

.ghost-eye-right {
  background-color: black;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 90px;
  right: 60%;
  z-index: 10000000;
}
.ghost-eye-left {
  background-color: black;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 90px;
  left: 60%;
  z-index: 10000000;
}

#ghost-arm-left {
  background-color: darkmagenta;
  width: 100px;
  height: 50px;
  top: 120px;
  left: 90%;
  border-top: black 1px solid;
  border-bottom: black 1px solid;
  border-bottom-right-radius: 100%;
  position: absolute;
  z-index: 10000000;
  transform: rotateZ(-50deg);
}
#ghost-arm-right {
  background-color: darkmagenta;
  width: 100px;
  height: 50px;
  top: 120px;
  right: 90%;
  border-top: black 1px solid;
  border-bottom: black 1px solid;
  border-bottom-left-radius: 100%;
  position: absolute;
  z-index: 10000000;
  transform: rotateZ(40deg);
}

#ghost-body {
  background-color: darkmagenta;
  min-width: 400px;
  min-height: 330px;
  position: absolute;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border: rgba(190, 190, 190, 0.4) 4px solid;
  border-bottom: none;
}

#ghost-body:after {
  background-color: darkmagenta;
  height: 24px;
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  content: "";
  clip-path: polygon(
    0 0,
    2.5% 100%,
    5% 0,
    7.5% 100%,
    10% 0,
    12.5% 100%,
    15% 0,
    17.5% 100%,
    20% 0,
    22.5% 100%,
    25% 0,
    27.5% 100%,
    30% 0,
    32.5% 100%,
    35% 0,
    37.5% 100%,
    40% 0,
    42.5% 100%,
    45% 0,
    47.5% 100%,
    50% 0,
    52.5% 100%,
    55% 0,
    57.5% 100%,
    60% 0,
    62.5% 100%,
    65% 0,
    67.5% 100%,
    70% 0,
    72.5% 100%,
    75% 0,
    77.5% 100%,
    80% 0,
    82.5% 100%,
    85% 0,
    87.5% 100%,
    90% 0,
    92.5% 100%,
    95% 0,
    97.5% 100%,
    100% 0
  );
}

#id-card {
  margin: 10px;
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
