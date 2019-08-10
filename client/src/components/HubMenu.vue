<template>
  <div id="nav">
    <router-link to="/mCclureEvents" class="menu-a">Helpful Personal Task Management</router-link>
    <br />
    <br />
    <router-link to="/warts" class="menu-a">web arts (warts)</router-link>
    <br />
    <br />
    <router-link to="/theauxts" class="menu-a">Control Theauxts</router-link>
    <br />
    <br />
    <router-link to="/jokL" class="menu-a">2 am Slekshun: jokL</router-link>
    <br />
    <br />
    <a href="#" class="menu-a">
      <s>Hirable!</s>
      <br />Not Ready Yet!
    </a>
    <br />
    <br />
    <!-- <router-link to="/ghosts" class="menu-a">Ghosts join room.</router-link> -->
    <br />
    <div id="footer">
      <div id="footer-branding">the shinepickaw creative ecosystem @ omon art</div>
      <div id="ghost-entry-link" @click="callGhost">Ghosts enter here.</div>
    </div>
    <GhostEntry :triggerAnim="this.ghostCalled"></GhostEntry>
  </div>
</template>

<script>
import GhostEntry from "./GhostEntry.vue";
export default {
  name: "HubMenu",
  components: {
    GhostEntry
  },
  data() {
    return {
      ghostCalled
    };
  },
  props: {
    msg: String
  },
  methods: {
    callGhost() {
      this.ghostCalled = true;
    }
  },
  mounted() {
    this.ghostCalled = false;
  }
};
</script>

<style lang="scss" scoped>
#footer {
  border-radius: 16px;
  padding: 6px;
  position: fixed;
  bottom: 5%;
  color: #efefef;
  background-color: black;
  display: flex;
  justify-content: space-between;
  #footer-branding {
    font-weight: 600;
    border-left: white 2px solid;
    border-right: white 2px solid;
    border-radius: 40px;
    padding-left: 4px;
    padding-right: 4px;
  }
  #ghost-entry-link {
    font-weight: 600;
    border-left: white 2px solid;
    border-right: white 2px solid;
    border-radius: 40px;
    padding-left: 4px;
    padding-right: 4px;
  }
}

#nav {
  margin: 30px;
  z-index: 2;
  background-color: rgba(23, 23, 23, 0.4);
  backdrop-filter: blur(5px);
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
</style>
