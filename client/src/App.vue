<template>
  <div id="app">
    <router-view/>
    <div id="nav">
      <router-link to="/theauxts">Control Theauxts</router-link><br><br>
      <router-link to="/jokL">2 am Slekshun: jokL</router-link>  <br><br>    
      <router-link to="/noSCL">See in NoSCL</router-link>
    </div>
    
    <div id="footer">
      the shinepickaw creative ecosystem @ omon art
    </div>
  </div>
</template>

<style lang="scss">
body {
  background-color:black;
  overflow: hidden;
}

#app {
  font-family: "Monaco", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  width: 100%;
  margin: 0 auto;
}
#nav {
  padding: 30px;
  margin-top:-396px;
  a {
    font-weight: bold;
    color: #060606;
    text-decoration: none;
    &.router-link-exact-active {
      color: #ececec;
    }
  }
}
#footer {
  color: #efefef;
  font-weight: 600;
  position: fixed;
  bottom: 5%;
}
</style>
