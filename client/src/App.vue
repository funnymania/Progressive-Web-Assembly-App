<template>
  <div id="app">
    <router-view/>
    <div id="footer">
      the shinepickaw creative ecosystem @ omon art
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
body {
  background-color:black;
  overflow: hidden;
}

#app {
  font-family: "Monaco", "Fira Mono", "DejaVu Sans Mono", "Courier New", Courier, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  width: 100%;
  margin: 0 auto;
}
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
#footer {
  color: #efefef;
  font-weight: 600;
  position: fixed;
  bottom: 5%;
}
</style>
