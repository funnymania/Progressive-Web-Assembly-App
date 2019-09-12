<template>
  <div id="app-root">
    <span id="help-top" @click="popUpBoxOnElementClick">How does this work?</span>
    <h2>mCclure's task loop</h2>
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
      <div class="queue-item" v-for="entry in queues[0]" :key="entry.id">
        <div class="queue-content-box conflicts">{{ entry.content }}</div>
        <div class="queue-entry-tb">
          <span class="close-textbox" @click="removeContentFromEntry(entry, $event)"></span>
        </div>
      </div>
      <div class="queue-item" v-for="entry in queues[1]" :key="entry.id">
        <div class="queue-content-box incomplete">{{ entry.content }}</div>
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
          </div>
          <div>
            <div id="move-it" @click="moveToQueue">Move to Queue...</div>
            <br />
            <input type="radio" id="first-queue-1" name="status-1" value="0" />
            <label for="first-queue-1" style="margin-right:35px;">Conflicts</label>
            <input type="radio" id="second-queue-1" name="status-1" value="1" checked />
            <label for="second-queue-1">Incomplete</label>
          </div>
        </div>
      </div>
      <div id="new-thing-segment">
        <h3>New Thing</h3>
        <textarea id="new-addon" />
        <div>
          <input type="radio" id="first-queue" name="status-2" value="0" />
          <label for="first-queue" style="margin-right:35px;">Conflicts</label>
          <input type="radio" id="second-queue" name="status-2" value="1" checked />
          <label for="second-queue">Incomplete</label>
          <div id="new-thing-submit" @click="addToQueue">Add to queue</div>
        </div>
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
      <span>{{genPopUpText }}</span>
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
const emptyText = "I am empty";
export default {
  name: "mCclureEvents",
  data() {
    return {
      boxNumber: 0,
      bit: 1,
      queues: [[], []],
      stack: {
        content: emptyText
      },
      popUpText: "",
      genPopUpTitle: "",
      genPopUpText: "",
      verbosePopUpText: ""
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
          this.boxNumber = resJ.the_stack.boxNumber;
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
          this.boxNumber = resJ.the_stack.boxNumber;
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
            this.boxNumber = resJ.the_stack.boxNumber;
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
    loadStackFromStorage() {
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
    setUpQueues(e) {
      // only support growing
      if (e.target.value < this.boxNumber) {
        alert(
          "Only support growing capacity from this input. Individually remove boxes below."
        );
      }

      for (let i = 0; i < e.target.value - this.boxNumber; i++) {
        this.queues[0].push({
          content: emptyText
        });
      }

      this.boxNumber = e.target.value;

      // Commit to localStorage
      localStorage.setItem("queues", JSON.stringify(this.queues));
      localStorage.setItem("boxNumber", this.boxNumber);

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
    clearEverything() {
      // Are you sure?
      this.popUpDialog();
    },
    popUpDialog() {
      let modal = document.getElementById("popup-dialog");
      modal.classList.toggle("show-modal");
    },
    popUpDialogChoice(e) {
      let modal = document.getElementById("popup-dialog");
      if (e.target.classList.contains("butt-yes")) {
        let initialState = this.$options.data.call(this);

        // then Clear backing data to default
        Object.assign(this.$data, initialState);

        // then clear local storage
        localStorage.setItem("queues", JSON.stringify(initialState.queues));
        localStorage.setItem("stack", JSON.stringify(initialState.stack));
        localStorage.setItem("bit", JSON.stringify(initialState.bit));
        localStorage.setItem(
          "boxNumber",
          JSON.stringify(initialState.boxNumber)
        );

        // and then save this.
        if (this.userState.userName) {
          this.saveYourStack();
        }

        modal.classList.toggle("show-modal");
      } else {
        modal.classList.toggle("show-modal");
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
            if (other.content != emptyText) {
              return 1;
            } else {
              return 0;
            }
          } else if (other.content == emptyText) {
            if (one.content != emptyText) {
              return -1;
            } else {
              return 0;
            }
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
      if (this.userState.userName) {
        this.saveYourStack();
      }
    },
    addToQueue(e) {
      if (this.stack.content == emptyText) {
        this.stack.content = document.getElementById("new-addon").value;
        localStorage.setItem("stack", JSON.stringify(this.stack));

        // Persist change to server
        if (this.userState.userName) {
          this.saveYourStack();
        }
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
        if (this.userState.userName) {
          this.saveYourStack();
        }
      } else {
        this.popUpBoxWithContent("You've already got yours hands full.");
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
        boxNumber: JSON.parse(localStorage.getItem("boxNumber"))
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
    popUpBoxOnElementClick(e) {
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
input[type="radio"] {
  background-color: #222;
  color: #ddd;
  height: 20px;
  width: 20px;
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
#help-top:hover,
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
  height: 200px;
  margin-bottom: 10px;
}
.queue-item {
  flex-grow: 1;
  border: 1px solid white;
  min-width: 170px;
  overflow: hidden;
  height: 200px;
  overflow-y: hidden;
  white-space: pre-wrap;
  position: relative;
}
.queue-content-box {
  margin: 3px 4px 3px 4px;
  height: 100%;
}
.incomplete {
  box-shadow: 0px 0px 12px 2px skyblue;
}
.conflicts {
  box-shadow: 0px 0px 12px 2px darkorange;
}
.queue-entry-tb {
  position: absolute;
  height: 15px;
  right: 10px;
  bottom: 10px;
}
.close-textbox {
  cursor: pointer;
  height: 17px;
  width: 17px;
  display: inline-block;
  background-color: white;
  border-radius: 50%;
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
#stack-share-button:hover,
#stack-share-button:focus,
#stack-share-button:active,
#clear-button:hover,
#clear-button:focus,
#clear-button:active,
.butt-yes:hover,
.butt-yes:focus,
.butt-yes:active,
.butt-no:hover,
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
#pop-it:hover,
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
#move-it:hover,
#move-it:focus,
#move-it:active {
  color: black;
  background-color: white;
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
#new-thing-submit:hover,
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
  transition-timing-function: ease-in-out, linear;
}
#toast.toast-up {
  animation: toast-up 2s;
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