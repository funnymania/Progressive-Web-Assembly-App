<template>
  <div id="app-root" @click="handleOutsideClicks">
    <span id="help-top" @click="popUpBoxOnElementClick">How does this work?</span>
    <h2>mCclure's task loop</h2>
    <div id="flex-top">
      <div id="bit-segment">
        <div class="sm-heading">bit: {{ this.bit }}</div>
      </div>
      <div id="input-segment">
        <label>Maximum processes allowed:</label>
        <input
          :value="this.processesAllowed"
          id="capacity-input"
          type="text"
          @keyup.enter="setUpQueues"
        />
      </div>
    </div>
    <div id="queue-enclosure">
      <div class="queue-item" v-for="entry in queues[0]" :key="entry.id">
        <div
          draggable="false"
          @dragstart="dragEntry(entry, $event)"
          @dragover="dragOverEntry"
          @drop="dropEntry($event)"
          class="queue-content-box conflicts"
          :class="{ 'empty-queue-entry': !entry.content }"
        >{{ entry.content }}</div>
        <div class="queue-entry-tb">
          <span class="close-textbox" @click="removeContentFromEntry(entry, $event)"></span>
        </div>
      </div>
      <div class="queue-item" v-for="entry in queues[1]" :key="entry.id">
        <div
          draggable="false"
          @dragstart="dragEntry(entry, $event)"
          @dragover="dragOverEntry"
          @drop="dropEntry($event)"
          class="queue-content-box incomplete"
          :class="{ 'empty-queue-entry': !entry.content }"
        >{{ entry.content }}</div>
        <div class="queue-entry-tb">
          <span class="close-textbox" @click="removeContentFromEntry(entry, $event)"></span>
        </div>
      </div>
    </div>
    <div id="stack-share-belt">
      <div id="stack-share-button" @click="shareYourStack">&#x1F95e; Share your stack!</div>
    </div>
    <div>
      <div id="clear-button" @click="clearEverything">&#x274C; Clear Everything</div>
    </div>
    <div id="bottom-sect">
      <div id="the-stack">
        <div class="sect-head">The Stack</div>
        <div id="stack-flex">
          <div>
            <span id="stack-content">{{ stack.content }}</span>
            <div id="pop-it" @click="taskComplete">Pop it!</div>
            <div id="move-it" @click="moveToQueue">Move to Queue...</div>
          </div>
          <div class="radio-options-flex">
            <div>
              <input type="radio" id="first-queue-1" name="status-1" value="0" />
              <label for="first-queue-1">Conflicts</label>
            </div>
            <div>
              <input type="radio" id="second-queue-1" name="status-1" value="1" checked />
              <label for="second-queue-1">Incomplete</label>
            </div>
          </div>
        </div>
      </div>
      <div id="new-thing-segment">
        <h3>New Thing</h3>
        <textarea id="new-addon" placeholder="Add new task here..." />
        <div class="radio-options-flex">
          <div>
            <input type="radio" id="first-queue" name="status-2" value="0" />
            <label for="first-queue" style="margin-right:35px;">Conflicts</label>
          </div>
          <div>
            <input type="radio" id="second-queue" name="status-2" value="1" checked />
            <label for="second-queue">Incomplete</label>
          </div>
        </div>
        <div id="new-thing-submit" @click="addToQueue">Add to queue</div>
        <div id="the-spinner" class="spinney glowing-green in-and-out-z">
          <span id="arrow-top"></span>
          <span id="arrow-bottom"></span>
        </div>
      </div>
    </div>
    <span id="toast"></span>
    <span id="verbose-text-box">
      <h2>The Game</h2>
      <span class="verbose-text">
        <span v-html="verbosePopUpText"></span>
      </span>
    </span>
    <span id="popup-dialog">
      <h3>Are you sure?</h3>
      <span class="butt-yes" @click="popUpDialogChoice">It's gone.</span>
      <span class="butt-no" @click="popUpDialogChoice">It's not.</span>
    </span>
    <span id="generic-pop-up-info">
      <h3>{{ genPopUpTitle}}</h3>
      <span>{{ genPopUpText }}</span>
    </span>
    <span id="share-url-box">
      <h3>Ghost Stack Url</h3>
      <span id="copy-field">{{ popUpText }}</span>
      <br />
      <button @click="copyToClipboard">copy</button>
    </span>
  </div>
</template>

<script>
const emptyText = "";
export default {
  name: "mCclureEvents",
  data() {
    return {
      processesAllowed: 4,
      bit: 1,
      queues: [[], []],
      stack: {
        content: emptyText
      },
      popUpText: "",
      genPopUpTitle: "",
      genPopUpText: "",
      verbosePopUpText: "",
      modalUp: false
    };
  },
  props: {
    userState: Object
  },
  mounted() {
    console.log(this.userState);
    // if user comes from sharedStack link, bring in the corresponding stack
    // else, if user not logged in, load from local storage
    // otherwise, if user is logged in, pull from server.
    if (this.$route.params.id && this.$route.params.user) {
      let reqStr =
        "seeSharedStack/" +
        this.$route.params.user +
        "/" +
        this.$route.params.id;
      fetch(reqStr, {
        credentials: "include"
      })
        .then(res => res.json())
        .then(resJ => {
          if (resJ.error) {
            throw resJ.msg;
          }
          this.processesAllowed = resJ.the_stack.processesAllowed;
          this.bit = resJ.the_stack.bit;
          this.queues = resJ.the_stack.queues;
          this.stack = resJ.the_stack.stack;
        })
        .catch(err => this.popUpBoxWithContent(err));
    } else if (
      !this.userState.userName ||
      this.userState.newChanges.mccEvents
    ) {
      console.log("Loading from storage...");
      this.loadStackFromStorage();
    } else {
      console.log("Phone home...");
      fetch("load-stack", {
        credentials: "include"
      })
        .then(res => res.json())
        .then(resJ => {
          if (resJ.error) {
            throw resJ.msg;
          }
          this.processesAllowed = resJ.the_stack.processesAllowed;
          this.bit = resJ.the_stack.bit;
          this.queues = resJ.the_stack.queues;
          this.stack = resJ.the_stack.stack;
        })
        .catch(err => {
          console.log(err);
          this.loadStackFromStorage();
        });
    }
  },
  watch: {
    userState(newVal) {
      console.log(newVal);
      if (newVal.userName != "" && !newVal.newChanges.mccEvents) {
        console.log("Phone home...");
        fetch("load-stack", {
          credentials: "include"
        })
          .then(res => res.json())
          .then(resJ => {
            console.log(resJ);
            if (resJ.error) {
              throw resJ.msg;
            }
            this.processesAllowed = resJ.the_stack.processesAllowed;
            this.bit = resJ.the_stack.bit;
            this.queues = resJ.the_stack.queues;
            this.stack = resJ.the_stack.stack;
          })
          .catch(err => {
            console.log(err);
            this.loadStackFromStorage();
          });
      }
    }
  },
  methods: {
    handleOutsideClicks(e) {
      // Hide all modals showing.
      let modals = document.getElementsByClassName("show-modal");
      for (let i = 0; i < modals.length; i++) {
        modals[i].classList.toggle("show-modal");
      }
    },
    dragEntry(entry, event) {
      event.dataTransfer.setData("text/plain", JSON.stringify(entry));
      event.dataTransfer.dropEffect = "move";
    },
    dragOverEntry(ev) {
      // This will cancel the dragover event, which makes dropping possible.
      ev.preventDefault();
    },
    dropEntry(event) {
      // Get data
      let movedEntry = event.dataTransfer.getData("text/plain");

      // Create a grouping context for entry
      let newGroup = [];

      // Save to localstorage

      // Persist change to server
      if (this.userState.userName) {
        this.saveYourStack();
      }
    },
    loadStackFromStorage() {
      let boxNumGrab = localStorage.getItem("processesAllowed");
      this.processesAllowed = boxNumGrab == null ? 4 : boxNumGrab;

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
          if (one.content == emptyText) {
            return 1;
          } else if (other.content == emptyText) {
            return -1;
          } else {
            return 0;
          }
        });
      }

      let stackGrab = JSON.parse(localStorage.getItem("stack"));
      this.stack = stackGrab == null ? { content: emptyText } : stackGrab;
    },
    setUpQueues(e) {
      // Enforce supported process amount
      if (e.target.value < 3 || e.target.value > 5) {
        this.toast("Only 3 - 5 processes supported.");
        return;
      }

      let queuedProcesses =
        this.queues[0].filter(el => el.content != emptyText).length +
        this.queues[1].filter(el => el.content != emptyText).length;

      // Cannot set processes allowed to less than processes extant
      if (e.target.value < queuedProcesses) {
        this.toast(
          `There are more than ${e.target.value} processes currently active`
        );
        return;
      }

      // Draw boxes if needed.
      let boxesToDraw = e.target.value - this.queues.flat().length;

      if (boxesToDraw < 0) {
        this.removeAnEntry(1);
      } else {
        for (let i = 0; i < boxesToDraw; i++) {
          this.queues[1].push({
            content: emptyText
          });
        }
      }

      this.processesAllowed = e.target.value;

      // Commit to localStorage
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("processesAllowed", this.processesAllowed);

      // Persist change to server
      if (this.userState.userName) {
        this.saveYourStack();
      }
    },
    removeContentFromEntry(entry, event) {
      entry.content = emptyText;
      localStorage.setItem("queues", JSON.stringify(this.queues));
      if (this.userState.userName) {
        this.saveYourStack();
      }
    },
    clearEverything(e) {
      e.stopPropagation();

      // Are you sure?
      this.popUpDialog();
    },
    popUpDialog() {
      let modal = document.getElementById("popup-dialog");
      modal.classList.toggle("show-modal");
      this.modalUp = true;
    },
    popUpDialogChoice(e) {
      let modal = document.getElementById("popup-dialog");
      if (e.target.classList.contains("butt-yes")) {
        let initialState = this.$options.data.call(this);

        // Clear backing data to default
        Object.assign(this.$data, initialState);

        // Set up queue from default.
        this.setUpQueues({
          target: { value: initialState.processesAllowed }
        });

        // then clear local storage
        localStorage.setItem("queues", JSON.stringify(initialState.queues));
        localStorage.setItem("stack", JSON.stringify(initialState.stack));
        localStorage.setItem("bit", JSON.stringify(initialState.bit));
        localStorage.setItem(
          "processesAllowed",
          JSON.stringify(initialState.processesAllowed)
        );

        // and then save this.
        if (this.userState.userName) {
          this.saveYourStack();
        }

        modal.classList.toggle("show-modal");
        this.modalUp = false;
      } else {
        modal.classList.toggle("show-modal");
        this.modalUp = false;
      }
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
      if (this.userState.userName) {
        this.saveYourStack();
      }
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
      if (this.userState.userName) {
        this.saveYourStack();
      }
    },
    moveToQueue(e) {
      e.stopPropagation();
      let stackContent = document.getElementById("stack-content");

      // grab value of status-1
      let queueNum = document.querySelector('input[name="status-1"]:checked')
        .value;

      if (queueNum == 1) {
        this.popUpInfoBoxWithContent(
          "Can't Do THAT!!",
          `
            Can only shift Conflicts to the queue. 
            Incomplete items MUST be taken care of in the stack. 
          `
        );
      } else {
        // Add to end.
        this.queues[queueNum].push({
          content: stackContent.innerHTML
        });

        // Sort such that empties are at the end.
        this.queues[queueNum].sort((one, other) => {
          if (one.content == emptyText) {
            return 1;
          } else if (other.content == emptyText) {
            return -1;
          } else {
            return 0;
          }
        });

        // now use bit to add to stack from correct queue
        // if one queue is empty, the other is, by virtue of above, necessarily non-empty
        // Flip bit if necessary.
        this.moveToStack();
      }
    },
    popUpInfoBoxWithContent(title, content) {
      this.genPopUpTitle = title;
      this.genPopUpText = content;
      let modal = document.getElementById("generic-pop-up-info");
      modal.classList.toggle("show-modal");
    },
    moveToStack() {
      let dequeue;
      if (this.queues[this.bit].every(el => el.content == emptyText)) {
        let checkInstead = this.bit == 0 ? 1 : 0;
        dequeue = this.queues[checkInstead].shift();
        if (dequeue.content == this.stack.content) {
          this.toast(
            "This stays on the stack, since there are no other tasks left in the queue to switch out with."
          );
        } else {
          this.stack = dequeue;
        }
      } else {
        dequeue = this.queues[this.bit].shift();
        if (dequeue.content == this.stack.content) {
          this.toast(
            "This stays on the stack, since there are no other tasks left in the queue to switch out with."
          );
        } else {
          this.stack = dequeue;
        }
        this.bit = this.bit == 0 ? 1 : 0;
      }

      // Commit to localStorage
      localStorage.setItem("stack", JSON.stringify(this.stack));
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("bit", this.bit);

      // Persist change to server
      if (this.userState.userName) {
        this.saveYourStack();
      }
    },
    // Returns either false, and a reason why; or true, and the trimmed string
    validateNewTask(taskContent) {
      let trimmedInput = taskContent.trim();
      if (trimmedInput == "") {
        return {
          res: "",
          msg: "Task cannot be empty."
        };
      }

      if (trimmedInput.length > 12000) {
        return {
          res: "",
          msg: "Task cannot be > 12000 characters"
        };
      }

      return {
        res: trimmedInput,
        msg: "Task format valid."
      };
    },
    addToQueue(e) {
      e.stopPropagation();

      let validateRes = this.validateNewTask(
        document.getElementById("new-addon").value
      );

      // If string invalid, return.
      if (!validateRes.res) {
        this.toast(validateRes.msg);
        return;
      }

      if (this.stack.content == emptyText) {
        this.stack.content = validateRes.res;
        localStorage.setItem("stack", JSON.stringify(this.stack));

        // Persist change to server
        if (this.userState.userName) {
          this.saveYourStack();
        }

        document.getElementById("new-addon").value = "";
      } else if (!this.isCapacityAtMax()) {
        // Add to the proper queue.
        let queueNum = document.querySelector('input[name="status-2"]:checked')
          .value;
        this.queues[queueNum].push({
          content: validateRes.res
        });

        // Remove the now uneccessary extra empty block from queue added to.
        this.removeAnEntry(queueNum);

        // Sort such that empties are at the end.
        this.queues[queueNum].sort((one, other) => {
          if (one.content == emptyText) {
            return 1;
          } else if (other.content == emptyText) {
            return -1;
          } else {
            return 0;
          }
        });

        localStorage.setItem("queues", JSON.stringify(this.queues));

        // Persist change to server
        if (this.userState.userName) {
          this.saveYourStack();
        }

        document.getElementById("new-addon").value = "";
      } else {
        this.popUpInfoBoxWithContent(
          "ONE ONLY HAS SO MANY HANDS",
          "...and your's are all full!"
        );
      }
    },
    removeAnEntry(queueNum) {
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
    },
    saveYourStack() {
      console.log("Saving Stack...");

      // If user logged in, note that these changes have yet to be persisted
      if (this.userState.userName != null && this.userState.userName != "") {
        this.$emit("unsavedChanges", { mccEvents: true });
      }

      // grab everything.
      let theStack = {
        stack: JSON.parse(localStorage.getItem("stack")),
        queues: JSON.parse(localStorage.getItem("queues")),
        bit: JSON.parse(localStorage.getItem("bit")),
        processesAllowed: JSON.parse(localStorage.getItem("processesAllowed"))
      };
      console.log(theStack);

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
            throw json.error;
          }
          if (
            this.userState.userName != null &&
            this.userState.userName != ""
          ) {
            this.$emit("unsavedChanges", { mccEvents: false });
          }
        })
        .catch(err => console.log(err));
    },
    shareYourStack() {
      // grab everything.
      let theStack = {
        stack: this.stack,
        queues: this.queues,
        bit: this.bit,
        processesAllowed: this.processesAllowed
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
        this.processesAllowed
      );
    },
    popUpBoxOnElementClick(e) {
      e.stopPropagation();
      this.verbosePopUpText = `This is a simple personal task management solution built with a focus on providing only limited control over its behavior.
        <br><br><h4><u><b>In short</b>:</u></h4> Add to queue, only work on what/s in the stack, pop off the stack when something is finished.
        <br><br><h4><u><b>More Detail</b></u></h4>Add any <b>New Thing</b> you come up with. If the <b>Stack</b> is empty, then your <b>New Thing</b> is added to it, otherwise it goes into one of the 2 <b>Queues</b>.
        <br><br>Both <b>Queues</b> behave identically, only coloring their items differently as <span style="color:skyblue;"><b>Incomplete</b></span> and <span style="color:darkorange;"><b>Conflicts</b></span> respectively.
        <br><br>The distinction between the two is for yourself to establish. <span style="color:skyblue;"><b>Incomplete</b></span> items are default, those which you have not completed. A <span style="color:darkorange;"><b>Conflicts</b></span> is something you are currently unable to take care of, because of something which is out of your control completely.
        <br><br>You only work on that which is on the <b>Stack</b>. <b><u>That's it</u></b>. If the item on the Stack is that of <span style="color:darkorange;"><b>Conflicts</b></span> you <b>MUST</b> address it. That is the game we are playing.
        <br><br>If the <span style="color:darkorange;"><b>Conflicts</b></span> is unresolved after addressing it, you may then <b>Move to Queue</b>. <span style="color:skyblue;"><b>Incomplete</b></span> items should always be completed when they are on the <b>Stack</b>. <b>No swapping for a better card</b>, that is the game we are playing here.
        <br><br>The <b>bit</b> value, 0 or 1, determines which of the two <b>Queues</b> are pulled from. This value flips between <span style="color:skyblue;"><b>Incomplete</b></span> and <span style="color:darkorange;"><b>Conflicts</b></span>, so that you must address <span style="color:darkorange;"><b>Conflicts</b></span> without bias towards lower hanging fruit. That is the game we are playing here.
        <br><br>The <b>capacity</b> item determines the size allowed of both <b>Queues</b> combined. Currently the default of 4 is recommended, on the next update, only 3-5 will be allowed.
        <br><br>If you find yourself wanting to take on more <b>New Things</b> while at full capacity, instead of increasing the capacity, complete what is in the <b>Stack</b> if you can. It is recommended that you only increase capacity if all items in the Queues are <span style="color:darkorange;"><b>Conflicts</b></span>.
        <br><br>Only three legal moves are allowed in the <b>Stack</b>. You can complete a task in the Stack by popping it, you can click <b>Moving to Queue</b> when in a <span style="color:darkorange;"><b>Conflicts</b></span> state, and a task/s state can be changed. <span style="color:skyblue;"><b>Incomplete</b></span> items cannot be moved back into the <b>Queues</b>, they must be completed, unless they become <span style="color:darkorange;"><b>Conflicts</b></span>.
        <br><br>If you are a registered <b>Ghost</b>, the stack will save automatically, and can be loaded from any device on login.
        <br><br>If you are unregistered, it will persist to your device, and will be removed upon clearing cache.
        <br><br>If you are registered, a unique link is associated with your shared stacks and will remain active forever.
        <br><br>If unregistered, it will only last until the next day's end.
        <br><br>Please tweet your comments or hopes and dreams or if you just want a ghost to talk to <a href="https://twitter.com/shinepickaw" style="color:white;font-weight:600;"><b>@shinepickaw</b></a>`;

      let modal = document.getElementById("verbose-text-box");
      modal.classList.toggle("show-modal");
      this.modalUp = true;
    },
    popUpBoxWithContent(text) {
      this.popUpText = text;
      let modal = document.getElementById("share-url-box");
      modal.classList.toggle("show-modal");
      this.modalUp = true;
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
      this.modalUp = false;
    },
    toast(msg) {
      let toastEl = document.getElementById("toast");

      // Remove all text nodes
      toastEl.childNodes.forEach(node => {
        if (node.nodeType == 3) {
          toastEl.removeChild(node);
        }
      });

      toastEl.append(document.createTextNode(msg));

      toastEl.classList.toggle("toast-up");
      setTimeout(() => {
        toastEl.classList.toggle("toast-up");
      }, 5000);
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
  font-size: 1rem;
  text-align: center;
}
input[type="radio"] {
  background-color: #222;
  color: #ddd;
  margin: 0 10px 0 34px;
  height: 25px;
  width: 25px;
  cursor: pointer;
  outline: none;
  border-radius: 20%;
  border: 3px solid #002211;
  vertical-align: bottom;
}

#app-root {
  position: relative;
  color: white;
  height: 100%;
}
#help-top {
  font-weight: 600;
  text-align: left;
  display: block;
  cursor: pointer;
}
#help-top:active,
#help-top:focus {
  text-decoration: underline;
}
#verbose-text-box {
  visibility: hidden;
  opacity: 0;
  overflow-y: auto;
  height: 90%;
  min-width: 480px;
  margin: 0 auto;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 1);
  color: white;
  border: skyblue 6px solid;
  top: 50%;
  position: absolute;
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s;
  padding: 0 10px 20px;
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
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.queue-item {
  flex-grow: 1;
  border: 1px solid white;
  min-width: 170px;
  overflow: hidden;
  height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  position: relative;
}
.queue-content-box {
  margin: 0px 6px 0px 6px;
  padding: 4px;
  box-sizing: border-box;
  height: 100%;
  position: relative;
}
.empty-queue-entry::after {
  content: "EMPTY";
  background-color: white;
  color: black;
  font-size: 1.4rem;
  padding: 8px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: 2s linear infinite blink;
  width: 90%;
  position: absolute;
  font-weight: 600;
}
/* .queue-content-box::after {
  content: "EMPTY";
  background-color: white;
  color: black;
  font-size: 1.4rem;
  padding: 8px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: 2s linear infinite blink;
  width: 90%;
  position: absolute;
  font-weight: 600;
} */
.incomplete {
  box-shadow: 0px -14px 12px 2px skyblue;
}
.conflicts {
  box-shadow: 0px -14px 12px 2px darkorange;
}
.queue-entry-tb {
  position: absolute;
  height: 15px;
  right: 10px;
  bottom: 17px;
}
.close-textbox {
  cursor: pointer;
  height: 25px;
  width: 25px;
  display: inline-block;
  background-color: white;
  border-radius: 27%;
  border: 1px solid black;
}
.close-textbox::before {
  content: "X";
  font-weight: 600;
  color: black;
}
#invisible-box {
  visibility: hidden;
}
#stack-share-button,
#clear-button,
.butt-yes,
.butt-no {
  padding: 5px 4px;
  border: white 1px solid;
  cursor: pointer;
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 6px;
}
#stack-share-button:focus,
#stack-share-button:active,
#clear-button:focus,
#clear-button:active,
.butt-yes:focus,
.butt-yes:active,
.butt-no:focus,
.butt-no:active {
  color: black;
  background-color: white;
}

#bottom-sect {
  display: flex;
  justify-content: space-around;
}
#the-stack {
}
#stack-content {
  margin-left: 14px;
  padding: 8px;
  min-width: 300px;
  min-height: 10px;
  display: inline-block;
  border: white 1px solid;
  white-space: pre-wrap;
  overflow: hidden;
}
#stack-flex {
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 0 auto;
  min-width: 325px;
}
#pop-it {
  color: white;
  background-color: black;
  padding: 5px 4px;
  font-weight: 600;
  margin-left: 14px;
  border: white 1px solid;
  border-radius: 10px;
  cursor: pointer;
}
#pop-it:focus,
#pop-it:active {
  color: black;
  background-color: white;
}
#move-it {
  color: white;
  background-color: black;
  padding: 5px 4px;
  font-weight: 600;
  margin-top: 8px;
  margin-left: 14px;
  border-radius: 10px;
  border: white 1px solid;
  cursor: pointer;
}
#move-it:focus,
#move-it:active {
  color: black;
  background-color: white;
}
.radio-options-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 10px;
}

#new-thing-segment {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 50%;
}
#new-thing-submit {
  color: white;
  background-color: black;
  padding: 5px 4px;
  font-weight: 600;
  margin-left: 14px;
  margin-top: 13px;
  border: white 1px solid;
  border-radius: 10px;
  cursor: pointer;
}
#new-thing-submit:focus,
#new-thing-submit:active {
  color: black;
  background-color: white;
}

#new-addon {
  height: 160px;
  overflow-y: auto;
  background-color: black;
  color: white;
  padding: 10px;
  margin-bottom: 8px;
  font-size: 0.9rem;
}
#new-addon::placeholder {
  font-size: 0.9rem;
}
#the-spinner {
  /* circle with four gaps, two of the gaps have a rotatedbox-shadow to represent the arrow */
  border: 9px solid transparent;
  border-radius: 50%;
  border-top-color: lightgrey;
  border-bottom-color: lightgrey;
  margin: 30px auto;
  height: 117px;
  transform: rotateZ(45deg);
  width: 117px;
  animation-name: rotateZ-scale-xy-in-out;
  animation-timing-function: linear;
  animation-direction: reverse;
  animation-duration: 8s;
  animation-iteration-count: infinite;
}
#arrow-top {
  border: solid lightgrey;
  border-width: 0 9px 9px 0;
  display: inline-block;
  position: absolute;
  padding: 9px;
  bottom: 84px;
  left: -7px;
  transform: rotate(90deg);
}
#arrow-bottom {
  border: solid lightgrey;
  border-width: 0 9px 9px 0;
  display: inline-block;
  top: 84px;
  right: -7px;
  padding: 9px;
  position: absolute;
  transform: rotate(270deg);
}
/* .glowing-green {
  -webkit-box-shadow: 0 0 60px 0 #eceecd;
  box-shadow: 0 0 60px 0 #eceecd;
} */
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
  /* transition-timing-function: ease-in-out, linear; */
}
#toast.toast-up {
  animation: 2.5s toast-up;
  animation-direction: alternate;
  animation-timing-function: linear;
  animation-iteration-count: 2;
}
#share-url-box,
#generic-pop-up-info,
#popup-dialog {
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
#share-url-box.show-modal,
#generic-pop-up-info.show-modal,
#verbose-text-box.show-modal,
#popup-dialog.show-modal {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity 0.25s 0s;
}
@keyframes rotateZ {
  0%,
  100% {
    transform: rotateZ(45deg);
  }
  50% {
    transform: rotateZ(225deg);
  }
}
@keyframes rotateZ-scale-xy-in-out {
  0% {
    transform: scale(1, 1) rotateZ(0deg);
  }
  25% {
    transform: scale(0.8, 0.8) rotateZ(90deg);
  }
  50% {
    transform: scale(1, 1) rotateZ(180deg);
  }
  75% {
    transform: scale(1.1, 1.1) rotateZ(270deg);
  }
  100% {
    transform: scale(1, 1) rotateZ(360deg);
  }
}
@keyframes toast-down {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
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
    opacity: 1;
    visibility: visible;
  }
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  88% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@media (min-width: 1200px) {
  .close-textbox {
    height: 17px;
    width: 17px;
  }
  .queue-entry-tb {
    bottom: 14px;
  }
  input[type="radio"] {
    width: 17px;
    height: 17px;
  }
}
@media (hover: hover) and (pointer: fine) {
  #pop-it:hover,
  #stack-share-button:hover,
  #clear-button:hover,
  #new-thing-submit:hover,
  .butt-yes:hover,
  .butt-no:hover,
  #move-it:hover {
    color: black;
    background-color: white;
  }
  #help-top:hover {
    text-decoration: underline;
  }
}
</style>