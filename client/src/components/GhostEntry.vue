<template>
  <div id="ghost-overlay">
    <div id="ghost-and-card">
      <div id="caring-ghost">
        <div class="ghost-eye-left"></div>
        <div class="ghost-eye-right"></div>
        <div id="ghost-body"></div>
        <div id="ghost-close">
          <div id="ghost-close-close">Close</div>
          <span id="ghost-close-button" @click="$emit('retractGhost')">X</span>
        </div>
        <div id="ghost-arm-left"></div>
        <div id="ghost-arm-right"></div>
      </div>
      <div id="id-card">
        <p>{{ cardSubtitle }}</p>
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
          type="password"
          name="ghost-pass"
          placeholder="Ghost pass here."
          autocomplete="on"
          @keyup.enter="phaseIn"
        />
        <div id="button-row">
          <span class="id-button" @click="phaseIn">Phase on in!</span>
          <div id="button-row-inner">
            <span class="id-button" @click="forgotPass">
              <s>Forgot Ghost Pass.</s>
            </span>
            <span class="id-button" @click="becomeGhost">Become a Ghost.</span>
          </div>
        </div>
        <div id="card-spacer"></div>
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
      allowSubmits: true,
      cardSubtitle: "Life is looking ..."
    };
  },
  props: {
    triggerAnim: false,
    ghostExit: false
  },
  watch: {
    triggerAnim(val) {
      let prefixes = ["webkit", "moz", "MS", "o", ""];

      let ghostCanal = document.getElementById("ghost-canal");
      let ghostAndCard = document.getElementById("ghost-and-card");

      if (val) {
        console.log("anim triggered");
        this.allowSubmits = false;

        for (let entry of prefixes) {
          ghostAndCard.addEventListener(
            entry + "animationend",
            this.animationEndListener.bind(null, ghostAndCard, ghostCanal)
          );
        }
        // add class fade-opacity to black-bg
        ghostCanal.classList.toggle("fade-opacity-to-80");
        console.log("fade begins");

        // add class scale-up to ghost-and-card
        ghostAndCard.classList.add("fade-in-scaleXY-bounce");
      } else {
        for (let entry of prefixes) {
          ghostAndCard.addEventListener(
            entry + "animationend",
            this.backToAppFromLogin.bind(null, ghostAndCard, ghostCanal)
          );
        }
        // add class fade-opacity to black-bg
        ghostCanal.classList.toggle("fade-opacity-to-80");
        console.log("fade begins");

        // add class scale-up to ghost-and-card
        ghostAndCard.classList.add("fade-in-scaleXY-bounce", "anim-reverse");
      }
    }
  },
  methods: {
    phaseIn() {
      // Grab values of input.
      let signin = {
        email: document.querySelector("input[name='ghost-email']").value,
        pass: document.querySelector("input[name='ghost-pass']").value
      };

      // validate.
      this.validate(signin.email, signin.pass)
        .then(() =>
          fetch("/phase-in", {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(signin)
          })
        )
        .then(res => res.json())
        .then(jsonres => {
          if (jsonres.msg == "Incorrect ghost creds.") {
            this.cardSubtitle = jsonres.msg;
          } else {
            // Paint 'WELCOME' vertically while screen rearranges
            // Hide 'WELCOME' when screen is finished.
            // For now just fadeBack(), update username variable, and change
            // 'Ghosts enter here.'
            // to 'WELCOME, jsonres.name'
            this.cardSubtitle = "Welcome.";
            // this.fadeBack();
            this.$emit("phaseIn", jsonres.name);
          }
        })
        .catch(err => {
          this.cardSubtitle = err;
        });
    },
    validate(email, pass) {
      return new Promise((res, rej) => {
        if (!email.includes("@")) {
          throw "Email address must be valid and corporeal";
        }
        if (pass == "") {
          throw "Pass must be non-empty.";
        }
        res();
      });
    },
    becomeGhost() {
      console.log("becoming ghost");
      // Grab values of input.
      let signUp = {
        email: document.querySelector("input[name='ghost-email']").value,
        pass: document.querySelector("input[name='ghost-pass']").value
      };

      // validate.
      this.validate(signUp.email, signUp.pass)
        .then(() =>
          fetch("become-ghost", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(signUp)
          })
        )
        .then(res => res.json())
        .then(jsonres => {
          if (jsonres.error) {
            throw jsonres.msg;
          }
          this.phaseIn();
        })
        .catch(err => {
          this.cardSubtitle = err;
        });
    },
    forgotPass(e) {
      // Animation of ghost moving card aside to new one.
      // this.ghostSwitchCard(e.target);
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
    fadeBack() {
      let prefixes = ["webkit", "moz", "MS", "o", ""];

      let ghostCanal = document.getElementById("ghost-canal");
      let ghostAndCard = document.getElementById("ghost-and-card");

      for (let entry of prefixes) {
        ghostAndCard.addEventListener(
          entry + "animationend",
          this.backToAppFromLogin.bind(null, ghostAndCard, ghostCanal)
        );
      }
      // add class fade-opacity to black-bg
      ghostCanal.classList.add("fade-opacity-to-80", "anim-reverse");
      console.log("fade begins");

      // add class scale-up to ghost-and-card
      ghostAndCard.classList.add("fade-in-scaleXY-bounce", "anim-reverse");
    },
    backToAppFromLogin(ghostCard, ghostCanal) {
      this.allowSubmits = false;
      // ghostCard.classList.add("ghost-and-card-finished-rev");
      ghostCard.classList.remove(
        "fade-in-scaleXY-bounce",
        "ghost-and-card-finished",
        "anim-reverse"
      );
    },
    animationEndListener(ghostCard, ghostCanal) {
      console.log("anime over");
      this.allowSubmits = true;
      ghostCard.classList.add("ghost-and-card-finished");
      ghostCard.classList.remove("fade-in-scaleXY-bounce");
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
  color: white;
  font-size: 0.9em;
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

#button-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 38px;
}
#ghost-overlay {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0%;
  left: 0%;
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
  transition: visibility 2s ease 0s, opacity 2s ease 0s;
}

.fade-in-scaleXY-bounce {
  animation: 2s fade-opacity-to-100, 2s scale-up-while-bouncing;
  animation-fill-mode: forwards;
}
.anim-reverse {
  animation-direction: reverse;
}

#ghost-canal.fade-opacity-to-80 {
  opacity: 0.92;
  visibility: visible;
  transition: visibility 0s ease 0s, opacity 2s ease 0s;
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
  transform: translate(-50%, -50%) scale(0.6, 0.6);
}

#caring-ghost {
  top: 299px;
  left: 50%;
  transform: translate(-50%, 0) scale(0.5, 0.5);
  position: absolute;
  width: 400px;
}
#ghost-close {
  position: absolute;
  z-index: 10000000;
  top: 200px;
  left: 50%;
  transform: translate(-50%, 0);
}

#ghost-close-close {
  font-size: 2em;
  border-bottom: white 2px solid;
}

#ghost-close-button {
  color: red;
  font-weight: bold;
  font-size: 3em;
  border: white 3px solid;
  margin-top: 5px;
  display: block;
  cursor: pointer;
  /* border-radius: 100%; */
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
  font-size: 29px;
}

.id-button:focus,
.id-button:active {
  color: darkmagenta;
  border-color: lightgrey;
  box-shadow: 0px 0px 60px;
}

#ghost-close-button:focus,
#ghost-close-button:active {
  box-shadow: 0px 0px 60px;
  color: black;
}

#button-row-inner {
  display: flex;
  width: 100%;
  margin-top: 29px;
  justify-content: space-between;
}

#card-spacer {
  height: 83px;
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
  0% {
    opacity: 0;
    visibility: visible;
  }
  100% {
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
@media (min-width: 1200px) {
  #ghost-and-card {
    width: 46%;
  }
  #caring-ghost {
    top: 170px;
    transform: translate(-50%, 0) scale(1, 1);
  }
}

@media (min-width: 825px) {
  #ghost-and-card {
    width: 46%;
    top: 50%;
  }
  #caring-ghost {
    top: 225px;
    transform: translate(-50%, 0) scale(0.7, 0.7);
  }
}

@media (min-width: 300px) {
  #ghost-and-card {
    top: 42%;
  }
  #id-card {
    font-size: 1rem;
  }
}

@media (hover: hover) and (pointer: fine) {
  .id-button:hover {
    color: darkmagenta;
    border-color: lightgrey;
    box-shadow: 0px 0px 60px;
  }

  #ghost-close-button:hover {
    box-shadow: 0px 0px 60px;
    color: black;
  }
}
</style>
