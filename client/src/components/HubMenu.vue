<template>
  <div id="nav">
    <router-link to="/theauxts" class="menu-a">Control Theauxts</router-link>
    <br>
    <br>
    <router-link to="/jokL" class="menu-a">2 am Slekshun: jokL</router-link>
    <br>
    <br>
    <router-link to="/hirable" class="menu-a">Hirable!</router-link>
  </div>
</template>

<script>
export default {
  name: "HubMenu",
  props: {
    msg: String
  }
};
</script>

<style lang="scss" scoped>
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #060606;
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
