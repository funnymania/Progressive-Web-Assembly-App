<template>
  <div id="app-root">
    <h2>mCclure's task loop</h2>
    <!-- TODO: Currently only support growing capacity + 2 queues -->
    <div id="flex-top">
      <div id="bit-segment">
        <div class="sm-heading">bit: {{ this.bit }}</div>
      </div>
      <div id="input-segment">
        <label>Enter your capacity:</label>
        <input id="capacity-input" type="text" @keyup.enter="setUpQueues" />
      </div>
    </div>
    <div id="queue-enclosure">
      <div class="queue-item" v-for="entry in queues[0]" :key="entry.id">{{ entry.content }}</div>
      <div class="queue-item" v-for="entry in queues[1]" :key="entry.id">{{ entry.content }}</div>
    </div>
    <div id="stack-share-belt">
      <div id="stack-share-button" @click="shareYourStack">Share your stack!</div>
    </div>
    <div id="bottom-sect">
      <div id="the-stack">
        <div class="sect-head">The Stack</div>
        <div id="stack-flex">
          <div>
            <span id="stack-content">{{ stack.content }}</span>
            <button id="pop-it" @click="taskComplete">Pop it!</button>
          </div>
          <div>
            <div id="move-it" @click="moveToQueue">Move to Queue...</div>
            <br />
            <input type="radio" id="first-queue-1" name="status-1" value="0" />
            <label for="first-queue-1">Conflicts</label>
            <input type="radio" id="second-queue-1" name="status-1" value="1" checked />
            <label for="second-queue-1">Incomplete</label>
          </div>
        </div>
      </div>
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
    <!-- <div id="the-spinner" class="spinney glowing-green in-and-out-z">
      <span id="arrow-top"></span>
      <span id="arrow-bottom"></span>
    </div>-->
    <span id="toast"></span>
    <span id="share-url-box">
      <h3>Ghost Stack Url</h3>
      <span id="copy-field">{{ popUpText }}</span>
      <br />
      <button @click="copyToClipboard">copy</button>
    </span>
  </div>
</template>

<script>
const emptyText = "I am empty";
export default {
  name: "mCclureEvents",
  data() {
    return {
      boxNumber: 0,
      bit: 1,
      queues: [],
      stack: {
        content: emptyText
      },
      popUpText: ""
    };
  },
  mounted() {
    // load from localStorage into data.
    let boxNumGrab = localStorage.getItem("boxNumber");
    this.boxNumber = boxNumGrab == null ? 0 : boxNumGrab;

    let bitGrab = localStorage.getItem("bit");
    this.bit = bitGrab == null ? 1 : bitGrab;

    let queuesGrab = JSON.parse(localStorage.getItem("queues"));
    let queuesDefault = [];
    queuesDefault.push([]);
    queuesDefault.push([]);
    this.queues = queuesGrab == null ? queuesDefault : queuesGrab;

    // Sort such that empties are at the end.
    for (let i = 0; i < this.queues.length; i++) {
      this.queues[i].sort((one, other) => {
        if (other.content == emptyText) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    let stackGrab = JSON.parse(localStorage.getItem("stack"));
    this.stack = stackGrab == null ? { content: emptyText } : stackGrab;
  },
  methods: {
    setUpQueues(e) {
      // only support growing
      if (e.target.value < this.boxNumber) {
        alert(
          "Only support growing capacity from this input. Individually remove boxes below."
        );
      }

      // search for invisible-box
      const box = document.getElementById("invisible-box");

      // duplicate the box boxNumber - e.value times, append class queue-box
      // let boxList = createElements(e.value - boxNumber, box);

      for (let i = 0; i < e.target.value - this.boxNumber; i++) {
        this.queues[0].push({
          content: emptyText
        });
      }

      this.boxNumber = e.target.value;
      // add boxList elements to queue-enclosure
      // let queueEnclosure = document.getElementById("queue-enclosure");

      // addBoxes(queueEnclosure, boxList);

      // Commit to localStorage
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("boxNumber", this.boxNumber);

      // Persist change to server
      this.saveYourStack();
    },
    taskComplete(e) {
      if (this.stack.content == emptyText) {
        return;
      }

      // remove item from stack
      this.stack.content = emptyText;

      // Pull from queue, if any is non-empty.
      if (this.queues.flat().some(el => el.content != emptyText)) {
        this.queueToStack();
      }

      // commit to local storage
      localStorage.setItem("stack", JSON.stringify(this.stack));

      // Persist change to server
      this.saveYourStack();
    },
    queueToStack() {
      if (this.queues[this.bit].every(el => el.content == emptyText)) {
        let checkInstead = this.bit == 0 ? 1 : 0;
        this.stack = this.queues[checkInstead].shift();
        this.queues[checkInstead].push({
          content: emptyText
        });
      } else {
        this.stack = this.queues[this.bit].shift();
        this.queues[this.bit].push({
          content: emptyText
        });

        this.bit = this.bit == 0 ? 1 : 0;
      }

      // Commit to localStorage
      localStorage.setItem("stack", JSON.stringify(this.stack));
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("bit", this.bit);

      // Persist change to server
      this.saveYourStack();
    },
    moveToQueue(e) {
      let stackContent = document.getElementById("stack-content");

      // grab value of status-1
      let queueNum = document.querySelector('input[name="status-1"]:checked')
        .value;

      // Add to end.
      this.queues[queueNum].push({
        content: stackContent.innerHTML
      });

      // Sort such that empties are at the end.
      this.queues[queueNum].sort((one, other) => {
        if (other.content == emptyText) {
          return -1;
        } else {
          return 0;
        }
      });

      // now use bit to add to stack from correct queue
      // if one queue is empty, the other is, by virtue of above, necessarily non-empty
      // Flip bit if necessary.
      this.moveToStack();
    },
    moveToStack() {
      if (this.queues[this.bit].every(el => el.content == emptyText)) {
        let checkInstead = this.bit == 0 ? 1 : 0;
        this.stack = this.queues[checkInstead].shift();
      } else {
        this.stack = this.queues[this.bit].shift();
        this.bit = this.bit == 0 ? 1 : 0;
      }

      // Commit to localStorage
      localStorage.setItem("stack", JSON.stringify(this.stack));
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("bit", this.bit);

      // Persist change to server
      this.saveYourStack();
    },
    addToQueue(e) {
      if (this.stack.content == emptyText) {
        this.stack.content = document.getElementById("new-addon").value;
        localStorage.setItem("stack", JSON.stringify(this.stack));

        // Persist change to server
        this.saveYourStack();
      } else if (!this.isCapacityAtMax()) {
        let queueNum = document.querySelector('input[name="status-2"]:checked')
          .value;
        this.queues[queueNum].push({
          content: document.getElementById("new-addon").value
        });

        let emptyToRemove = this.queues[queueNum].findIndex(
          el => el.content == emptyText
        );
        if (emptyToRemove == -1) {
          queueNum = queueNum == 0 ? 1 : 0;
          emptyToRemove = this.queues[queueNum].findIndex(
            el => el.content == emptyText
          );
          this.queues[queueNum].splice(emptyToRemove, 1);
        } else {
          this.queues[queueNum].splice(emptyToRemove, 1);
        }

        // Sort such that empties are at the end.
        this.queues[queueNum].sort((one, other) => {
          if (one.content == emptyText) {
            return 1;
          } else {
            return 0;
          }
        });

        localStorage.setItem("queues", JSON.stringify(this.queues));

        // Persist change to server
        this.saveYourStack();
      } else {
        this.toast("You've already got yours hands full.");
      }
    },
    saveYourStack() {
      // grab everything.
      let theStack = {
        stack: this.stack,
        queues: this.queues,
        bit: this.bit,
        boxNumber: this.boxNumber
      };

      // ship it.
      fetch("save-stack", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(theStack)
      })
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            console.log(json.error);
          }
        })
        .catch(err => console.log(json.error));
    },
    shareYourStack() {
      // grab everything.
      let theStack = {
        stack: this.stack,
        queues: this.queues,
        bit: this.bit,
        boxNumber: this.boxNumber
      };

      // ship it.
      fetch("share-stack", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(theStack)
      })
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            throw json.msg;
          }
          this.popUpBoxWithContent(json.url);
        })
        .catch(err => this.popUpBoxWithContent(err));
    },
    isCapacityAtMax() {
      return (
        this.queues.flat().filter(el => el.content != emptyText).length ==
        this.boxNumber
      );
    },
    popUpBoxWithContent(text) {
      this.popUpText = text;
      let modal = document.getElementById("share-url-box");
      modal.classList.toggle("show-modal");
    },
    copyToClipboard() {
      let toCopy = document.createElement("INPUT");
      document.body.appendChild(toCopy);
      toCopy.setAttribute("value", this.popUpText);
      toCopy.select();
      document.execCommand("copy");
      document.body.removeChild(toCopy);

      let modal = document.getElementById("share-url-box");
      modal.classList.toggle("show-modal");
    },
    toast(msg) {
      let toastEl = document.getElementById("toast");

      toastEl.classList.remove("toast-up");

      // Remove all text nodes
      toastEl.childNodes.forEach(node => {
        if (node.nodeType == 3) {
          toastEl.removeChild(node);
        }
      });

      toastEl.append(document.createTextNode(msg));
      toastEl.classList.add("toast-up");
    }
  }
};
</script>

<style scoped>
input[type="text"] {
  background-color: black;
  color: white;
  border: none;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  outline: none;
  text-align: center;
}
#app-root {
  position: relative;
  color: white;
  height: 100%;
}
#flex-top {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
  /* outer black border around every element */
  /* incomplete are blue bordered, conflicts are orange */
  /* every element needs to take up a minimal and maximal dimension 20% of screen is max... */
}
.sect-head {
  font-size: 1.5em;
  margin-top: 1em;
  margin-bottom: 1em;
}
#sect-bottom {
  display: flex;
  width: 100%;
}
#queue-enclosure {
  display: flex;
  height: 200px;
  margin-bottom: 10px;
}
.queue-item {
  flex-grow: 1;
  border: 1px solid white;
  min-width: 200px;
}
#invisible-box {
  visibility: hidden;
}
#stack-share-button {
  padding: 5px 4px;
  border: white 1px solid;
  cursor: pointer;
  font-weight: bold;
}
#bottom-sect {
  display: flex;
  justify-content: space-around;
}
#the-stack {
}
#stack-content {
  margin-left: 14px;
  margin-right: 14px;
  padding: 8px;
  min-width: 300px;
  display: inline-block;
  border: white 1px solid;
}
#stack-flex {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
#move-it {
  color: white;
  background-color: black;
  padding-left: 8px;
  padding-right: 8px;
  min-width: 300px;
  margin-left: 14px;
  border-left: white 1px solid;
  border-right: white 1px solid;
  border-bottom: white 1px solid;
  cursor: pointer;
}
#new-thing-segment {
  display: flex;
  flex-direction: column;
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
  -webkit-box-shadow: 0 0 201px 0 #eceecd;
  box-shadow: 0 0 201px 0 #eceecd;
}
.in-and-out-z {
  /* move in and out of z OR scale x and y together */
}
.sm-heading {
  font-size: 1em;
  font-weight: bold;
}
#toast {
  visibility: hidden;
  opacity: 0;
  margin: 0 auto;
  top: 50%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: lightgrey 1px solid;
  transition-timing-function: ease-in-out, linear;
}
#toast.toast-up {
  animation: toast-up 2s;
}
#share-url-box {
  visibility: hidden;
  opacity: 0;
  margin: 0 auto;
  transform: translate(-50%, -100%);
  background-color: rgba(0, 0, 0, 1);
  color: white;
  border: skyblue 6px solid;
  top: 50%;
  position: absolute;
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s;
  padding: 0 10px 20px;
}
#share-url-box.show-modal {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity 0.25s 0s;
}
@keyframes toast-up {
  0% {
    opacity: 0;
    visibility: visible;
  }
  50% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
</style>