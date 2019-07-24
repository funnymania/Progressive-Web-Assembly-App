<template>
  <!-- TODO: On click catchUnicorn() -->
  <div id="unicorn-harvest">
    <div v-for="entry in listOfJobs" :key="entry.id">
      <div class="cornCard" @click="unicornCapture()">
        <div class="iconSegment">
          <div class="cornIcon">
            <img :src="iconDisplay(entry)" />
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
    unicornCapture(e) {
      // this.playAnimation()
      // this.saveThisToLocalStorage()
    },
    playAnimation() {
      // On animation complete...
      // this.openPostingInNewTab
    }
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
}

.iconSegment {
}

.cornIcon {
  height: 80%;
}

.cornDesc {
}
</style>
