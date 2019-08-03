<template>
  <div>
    <h2>mCclure's task loop</h2>
    <!-- TODO: Currently only support growing capacity + 2 queues -->
    <div class="flex-top">
      <div id="bit-segment">
        <h3>bit: {{ this.bit }}</h3>
      </div>
      <div id="input-segment">
        <label>Enter your capacity:</label>
        <input id="capacity-input" @keyDown(enter)="setUpQueues" />
      </div>
    </div>
    <div v-for="entry in queues" id="queue-encolusure" :key="entry.id">
      <div id="queue-item">{{ entry.content }}</div>
    </div>
    <div id="the-stack">
      <h2>The Stack</h2>
      <h3 id="stack-content">{{ stack.content }}</h3>
      <button id="pop-it" @click="taskComplete">Pop it!</button>
      <button id="move-it" @click="moveToQueue">Move to Queue...</button>
      <input type="radio" id="first-queue-1" name="status-1" value="0" />
      <label for="first-queue-1">Conflicts</label>
      <input type="radio" id="second-queue-1" name="status-1" value="1" checked />
      <label for="second-queue-1">Incomplete</label>
      <div id="new-thing-segment">
        <h3>New Thing</h3>
        <textarea id="new-addon" />
        <input type="radio" id="first-queue" name="status-2" value="0" />
        <label for="first-queue">Conflicts</label>
        <input type="radio" id="second-queue" name="status-2" value="1" checked />
        <label for="second-queue">Incomplete</label>
        <button id="new-thing-submit" @click="addToQueue">Add to queue</button>
      </div>
    </div>
    <div id="the-spinner" class="spinney gowing-green in-and-out-z">
      <span id="arrow-top"></span>
      <span id="arrow-bottom"></span>
    </div>
    <span id="toast"></span>
  </div>
</template>

<script>
export default {
  name: "mCclureEvents",
  data() {
    return {
      boxNumber: 0,
      bit: 1,
      queues: [],
      stack: {
        content: "I am empty"
      }
    };
  },
  mounted() {
    // load from localStorage into data.
    let boxNumGrab = localStorage.getItem("boxNumber");
    this.boxNumber = boxNumGrab == null ? 0 : boxNumGrab;

    let bitGrab = localStorage.getItem("bit");
    this.bit = bitGrab == null ? 1 : bitGrab;

    let queuesGrab = JSON.parse(localStorage.getItem("queues"));
    this.queues = queuesGrab == null ? [] : queuesGrab;

    let stackGrab = JSON.parse(localStorage.getItem("stack"));
    this.stack = stackGrab == null ? 0 : stackGrab;
  },
  methods: {
    setUpQueues(e) {
      // only support growing
      if (e.value < this.boxNumber) {
        alert(
          "Only support growing capacity from this input. Individually remove boxes below."
        );
      }

      // search for invisible-box
      const box = document.getElementById("invisible-box");

      // duplicate the box boxNumber - e.value times, append class queue-box
      let boxList = createElements(e.value - boxNumber, box);

      // add boxList elements to queue-enclosure
      let queueEnclosure = document.getElementById("queue-enclosure");

      addBoxes(queueEnclosure, boxList);

      // Commit to localStorage
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("boxNumber", this.boxNumber);
    },
    taskComplete(e) {
      // remove item from stack
      this.stack.content = "I am empty";

      // commit to local storage
      localStorage.setItem("stack", JSON.stringify(this.stack));
    },
    moveToQueue(e) {
      let stackContent = document.getElementById("stack-content");

      // grab value of status-1
      let queueNum = document.querySelector('input[name="status-1"]:checked')
        .value;

      // add entry to correct queue
      queue[queueNum].push(stackContent);

      // now use bit to add to stack from correct queue
      // if one queue is empty, the other is, by virtue of above, necessarily non-empty
      // Flip bit if necessary.
      if (queue[this.bit] == undefined || queue[this.bit].length == 0) {
        let checkInstead = this.bit == 0 ? 1 : 0;
        this.stack.content = queue[checkInstead].shift();
      } else {
        this.stack.content = queue[this.bit].shift();
        this.bit = this.bit == 0 ? 1 : 0;
      }

      // Commit to localStorage
      localStorage.setItem("stack", JSON.stringify(this.stack));
      localStorage.setItem("queue", JSON.stringify(this.queue));
      localStorage.setItem("bit", this.bit);
    },
    addToQueue(e) {
      if (stack.content == "I am empty") {
        this.stack.content = document.getElementById("new-addon").value;
        localStorage.setItem("stack", JSON.stringify(this.stack));
      } else if (isCapacityAtMax()) {
        let queueNum = document.querySelector('input[name="status-2"]:checked')
          .value;
        queue[queueNum].push(document.getElementById("new-addon").value);
        localStorage.setItem("queue", JSON.stringify(this.queue));
      } else {
        toast("You've already got your hands full.");
      }
    },
    toast(msg) {
      let toastEl = document.getElementById("toast");

      toastEl.classList.remove("toast-up");

      toastEl.append(document.createTextNode(msg));
      toastEl.classList.add("toast-up");
    }
  }
};
</script>

<style scoped>
#app-root {
  position: relative;
}
#flex-top {
  display: flex;
  height: 40%;
  padding-top: 10%;
  /* needs to center elements */
  /* outer black border around every element */
  /* incomplete are blue bordered, conflicts are orange */
  /* every element needs to take up a minimal and maximal dimension 20% of screen is max... */
}
#invisible-box {
  visibility: hidden;
}
#the-stack {
  position: absolute;
  height: 50%;
}
#new-thing-segment {
  display: flex; /* run vertical */
}
#the-spinner {
  /* circle with four gaps, two of the gaps have a rotatedbox-shadow to represent the arrow */
  border: 3px solid transparent;
  border-radius: 50%;
  border-top-color: lightgrey;
  border-bottom-color: lightgrey;
}
#arrow-top {
  box-shadow: -2px -2px 0 rgba(255, 255, 255, 0.5);
}
#arrow-bottom {
  box-shadow: -2px -2px 0 rgba(255, 255, 255, 0.5);
}
.spinney {
  /* rotates slowly */
}
.glowing-green {
  /* glow radius enlarge to shrink animation */
}
.in-and-out-z {
  /* move in and out of z OR scale x and y together */
}
#toast {
  visibility: hidden;
  opacity: 0;
  margin: 0 auto;
  top: 50%;
  position: absolute;
}
.toast-up {
  transition: opacity, visibility;
  transition-duration: 1s, 0s;
  transition-timing-function: ease-in-out, linear;
}
</style>