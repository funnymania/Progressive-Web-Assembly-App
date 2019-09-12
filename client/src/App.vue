<template>
  <div id="app">
    <router-view :userState="this.userState" @unsavedChanges="newUnpersistedState" />
    <div id="footer">
      <!-- <div id="footer-branding">the shinepickaw creative ecosystem @ omon art</div> -->
      <div id="ghost-entry-link" @click="callGhost">{{ logInText }}</div>
    </div>
    <GhostEntry
      @retractGhost="ghostCalled = false"
      @phaseIn="changeToPhaseUi"
      :triggerAnim="this.ghostCalled"
    ></GhostEntry>
  </div>
</template>

<script>
import GhostEntry from "./components/GhostEntry.vue";
export default {
  name: "app",
  components: {
    GhostEntry
  },
  data() {
    return {
      ghostCalled: false,
      logInText: "Ghosts enter here.",
      userState: {
        userName: "",
        newChanges: {
          mccEvents: false
        }
      }
    };
  },
  methods: {
    callGhost() {
      this.ghostCalled = true;
      this.logInText = "Ghosts enter here.";
    },
    changeToPhaseUi(uname) {
      localStorage.setItem("userName", uname);
      this.userState.userName = uname;
      this.logInText = "WELCOME, " + this.userState.userName;
      this.ghostCalled = false;
    },
    newUnpersistedState(state) {
      Object.assign(this.userState.newChanges, state);
    }
  },
  mounted() {
    this.userState.userName = localStorage.getItem("userName");
    if (this.userState.userName != null && this.userState.userName != "") {
      this.logInText = "WELCOME, " + this.userState.userName;
    }
  }
};
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  background-color: black;
  height: 100%;
}

#app {
  font-family: "Monaco", "Fira Mono", "DejaVu Sans Mono", "Courier New", Courier,
    monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #777777;
    text-decoration: none;
    &.router-link-exact-active {
      color: #ececec;
    }
    &:hover {
      color: #ececec;
    }
  }
  .menu-a {
    display: inline-block;
    padding-bottom: 15px;
  }
}
#footer {
  border-radius: 16px;
  padding: 6px;
  position: fixed;
  bottom: 3%;
  color: #efefef;
  background-color: black;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  #footer-branding {
    font-weight: 600;
    border: white 1px solid;
    border-radius: 40px;
    padding-top: 2px;
    padding-right: 4px;
    padding-left: 4px;
    &:hover,
    &:focus,
    &:active {
      border: white 1px dashed;
      cursor: pointer;
    }
  }
  #ghost-entry-link {
    font-weight: 600;
    border: white 1px solid;
    border-radius: 40px;
    padding-left: 4px;
    padding-right: 4px;
    padding-top: 2px;
    &:focus,
    &:active,
    &:hover {
      border: white 1px dashed;
      cursor: pointer;
    }
  }
}
</style>
