<template>
  <div id="nav">
    <router-link to="/mCclureEvents" class="menu-a">Helpful Personal Task Management</router-link>
    <br />
    <br />
    <router-link to="/hirable" class="menu-a">Hirable!</router-link>
    <br />
    <br />
    <router-link to="/warts" class="menu-a">web arts (warts)</router-link>
    <br />
    <br />
    <router-link to="/events" class="menu-a">Capitol Hill Art Exhibition</router-link>
    <br />
    <br />
    <router-link to="/theauxts" class="menu-a">Control Theauxts</router-link>
    <br />
    <br />
    <router-link to="/jokL" class="menu-a">2 am Slekshun: jokL</router-link>
    <br />
    <br />
    <!-- <router-link to="/ghosts" class="menu-a">Ghosts join room.</router-link> -->
    <!-- <div id="footer">
      <div id="footer-branding">the shinepickaw creative ecosystem @ omon art</div>
      <div id="ghost-entry-link" @click="callGhost">Ghosts enter here.</div>
    </div>-->
    <!-- <GhostEntry :triggerAnim="this.ghostCalled"></GhostEntry> -->
  </div>
</template>

<script>
export default {
  name: "HubMenu",
  props: {
    msg: String,
    userState: Object
  }
};
</script>

<style lang="scss" scoped>
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
