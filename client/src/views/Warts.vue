<template>
  <div id="nav">
    <router-link to="/switchArt" class="menu-a">switch-art</router-link>
  </div>
</template>

<script>
export default {
  name: "Warts"
};
</script>

<style lang="scss">
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
