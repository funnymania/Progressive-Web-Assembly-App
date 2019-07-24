<template>
  <!-- TODO: On click catchUnicorn() -->
  <div id="unicorn-harvest">
    <div v-for="entry in listOfJobs" :key="entry.id">
      <div class="cornCard" @click="unicornCapture(entry)">
        <div class="iconSegment">
          <div class="cornIcon">
            <img :src="iconDisplay(entry)" />
          </div>
          <div class="cornHorn">
            <img src="../assets/unicornHorn.svg" />
          </div>
          <div
            class="declaration"
          >{{ entry.compName[0].toUpperCase() + entry.compName.substr(1) + 'Corn!' }}</div>
        </div>
        <div class="cornDesc">
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.desc }}</p>
        </div>
        <span id="cornCaption"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobRes",
  props: {
    listOfJobs: Array
  },
  methods: {
    iconDisplay(e) {
      return require("../assets/" + e.compName + ".svg");
    },
    // e is card
    unicornCapture(e, entry) {
      console.log(e);
      console.log(entry);
      this.playAnimation(e, entry);
      // this.saveThisToLocalStorage()
    },
    playAnimation(e, entry) {
      // Pop up little rectangle saying '+1 AppleCorn captured!' at cursor

      // Get popup element, move to cursor location
      let popup = document.getElementById("cornCaption");
      popup.style.left = e.offsetX;
      popup.style.top = e.offsetY;

      // Animate it
      popup.classList.add("animate");

      // Get url, pass to open after some time passes
      setTimeout(window.open(url, "_blank"), 500);
    },
    animationEndListener(e) {
      e.classList.remove("animate");
    }
  },
  mounted() {
    // Setup animation listeners
    let popup = document.getElementById("cornCaption");
    let prefixes = ["webkit", "moz", "MS", "o", ""];

    prefixes.forEach(entry => {
      popup.addEventListener(
        entry + "animationend",
        this.animationEndListener(popup)
      );
    });
  }
};
</script>

<style scoped>
#unicorn-harvest {
  margin: 80px auto;
  width: 60%;
}

.cornCard {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: center;
  padding: 30px;
  margin: 10px;
  border: 1px solid lightpink;
  position: relative;
  cursor: pointer;
}

#cornCaption {
  background-color: palegreen;
  color: black;
  visibility: hidden;
  position: absolute;
  padding: 4px;
}

#cornCaption.animate {
  animation: 1s visible-to-invisible;
}

.cornHorn img {
  width: 12%;
  position: absolute;
  top: -11px;
}

.cornIcon {
  height: 80%;
}

.iconSegment {
  height: 100%;
}

.cornDesc {
}

@keyframes visible-to-invisible {
  from {
    visibility: visible;
  }
  to {
    visibility: hidden;
  }
}
</style>
