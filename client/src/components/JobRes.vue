<template>
  <div id="unicorn-harvest">
    <div v-for="entry in listOfJobs" :key="entry.id">
      <div class="cornCard" @click="unicornCapture(entry, $event)">
        <div class="iconSegment">
          <div class="icon-and-horn">
            <img class="cornIcon" :src="iconDisplay(entry)" />
            <img class="cornHorn" src="../assets/unicornHorn.svg" />
          </div>
          <div
            class="declaration"
          >{{ entry.compName[0].toUpperCase() + entry.compName.substr(1) + 'Corn!' }}</div>
        </div>
        <div class="cornDesc">
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.desc }}</p>
        </div>
      </div>
    </div>
    <span id="cornCaption"></span>
  </div>
</template>

<script>
export default {
  name: "JobRes",
  props: {
    listOfJobs: Array
  },
  watch: {
    listOfJobs(val) {
      // this.$nextTick(() => {
      if (val.length > 0) {
        let popup = document.getElementById("cornCaption");
        let prefixes = ["webkit", "moz", "MS", "o", ""];

        for (let entry of prefixes) {
          popup.addEventListener(
            entry + "animationend",
            this.animationEndListener.bind(null, popup)
          );
        }
      }
      // });
    }
  },
  methods: {
    iconDisplay(e) {
      return require(`../assets/${e.compName}.svg`);
    },
    unicornCapture(entry, event) {
      this.playAnimation(entry, event);
      this.saveThisToLocalStorage(entry);
    },

    // Pop up little rectangle saying '+1 AppleCorn captured!' at cursor
    playAnimation(e, event) {
      // Get popup element, move to cursor location
      let popup = document.getElementById("cornCaption");
      let popupText = document.createTextNode(
        "+1 " +
          e.compName[0].toUpperCase() +
          e.compName.substr(1) +
          "Corn captured!"
      );
      popup.append(popupText);
      document.body.append(popup);

      popup.style.left = event.pageX + "px";
      popup.style.top = event.pageY + "px";

      // Animate it
      popup.classList.add("animate");

      // Get url, pass to open after some time passes
      setTimeout(() => window.open(e.url, "_blank"), 700);
    },
    animationEndListener(e) {
      e.classList.remove("animate");

      // Remove all text nodes
      e.childNodes.forEach(node => {
        if (node.nodeType == 3) {
          e.removeChild(node);
        }
      });
    },

    saveThisToLocalStorage(corn) {
      let liveCorns = localStorage.getItem("liveUnicorns");
      if (liveCorns == null) {
        liveCorns = [];
        liveCorns.push(corn);
        localStorage.setItem("liveUnicorns", JSON.stringify(liveCorns));
      } else {
        let addMe = JSON.parse(liveCorns);
        let isPresent = false;
        for (let el of addMe) {
          if (el.desc == corn.desc && el.url == corn.url) {
            isPresent = true;
            break;
          }
        }
        if (!isPresent) {
          addMe.push(corn);
          localStorage.setItem("liveUnicorns", JSON.stringify(addMe));
        }
      }
    }
  }
};
</script>

<style scoped>
.icon-and-horn {
  position: relative;
}
#unicorn-harvest {
  margin: 80px auto;
  width: 60%;
}

.cornCard {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: space-evenly;
  padding: 30px;
  margin: 10px 0;
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
  animation: 0.5s visible-to-invisible;
}

.cornHorn {
  width: 100%;
  position: absolute;
  top: -31%;
  left: 50%;
}

.cornIcon {
  /* height: 80%;
  width: 23%; */
}

.iconSegment {
  height: 100%;
}

.cornDesc {
  margin: 0 20px;
  width: 50%;
  min-width: 150px;
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
