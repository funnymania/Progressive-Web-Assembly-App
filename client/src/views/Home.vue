<template>
  <div class="home">
    <img class="logo" src="../assets/logo.png">
    <br>
    <div class="move-me">
      <div class="shadow-only door-1 animate-s"></div>
    </div>
    <br>
    <div class="move-me">
      <div class="shadow-only door-2 animate-r"></div>
    </div>
    <br> 
    <div class="move-me">
      <div class="shadow-only door-1 animate-lb"></div>  
    </div>  
  </div>
</template>

<script>
export default {
  name: "home"
};

let squares = document.getElementsByClassName("move-me");

setInterval( () => { 
  for (let square of squares) {
    let tmpX = square.style.transformX;
    let tmpY = square.style.transformY;
    tmpX = -60 * Math.random() - 6;
    tmpY = -60 * Math.random() - 6; 
    square.style.transformX = "" + tmpX + "vw";
    square.style.transformY = "" + tmpY + "vh";
  }
}, 10000)
</script>

<style scoped>
.home .logo {
  filter: drop-shadow(0px 0px 30px #eced);
  -webkit-filter: drop-shadow(0 0 30px #eced);
  margin: auto;
  display: block;
}

.move-me {
  height: 0;
}

.door-1 {
  margin-left: -59%;
  margin-top: -6%;
}

.animate-s {
  animation: aslide 14s infinite, rotate 20s infinite, switch 20s infinite;
}

.animate-r {
  animation: aslide 14s infinite, rotate 20s infinite, switch-r 20s infinite;
} 

.animate-lb {
  animation: aslide 14s infinite, rotate 20s infinite, switch-lb 20s infinite;  
}

@keyframes switch {
  0%, 100% {
    transform: translate(0,0) rotate(360deg);
  }
  25% {
    transform: translate(70vw,0) rotate(17.5deg);
  }
  50% {
    transform: translate(0,0) rotate(17.5deg);
  }
  75% {
    transform: translate(0,75vh) rotate(0deg);
  }
  80% {
    transform: translate(0,58vh) rotate(-270deg);
  }
}

@keyframes switch-lb {
  0%, 100% {
    transform: translate(0,0) rotate(180deg);
  }
  25% {
    transform: translate(-5vw,160vh) rotate(17.5deg);
  }
  50% {
    transform: translate(0,-80vh) rotate(-200deg);
  }
  75% {
    transform: translate(0,-75%) rotate(0deg);
  }
  80% {
    transform: translate(0,-58%) rotate(180deg);
  }
}

@keyframes switch-r {
  0%, 100% {
    transform: translate(0,0) rotate(360deg);
  }
  25% {
    transform: translate(-70%,0) rotate(-17.5deg);
  }
  50% {
    transform: translate(0,0) rotate(-17.5deg);
  }
  75% {
    transform: translate(0,-75%);
  }
  80% {
    transform: translate(0,-58%) rotate(270deg);
  }
}


@keyframes rotate {
  0%, 100% {
    transform: rotate(360deg);
  }
  50% {
    transform: rotate(35deg);
  }
  80% {
    transform: rotate(-270deg);
  }
}

@keyframes aslide {
  0%, 50%, 100% {
    width: 14%;
  }
  25% {
    width: 33%;
  }
  75% {
    width: 0%;
  }
}

.shadow-only {
  height: 160px;
  display: inline-block;
  box-shadow: 0 0 201px 0 #ECEECD, 0 0 0 147px rgba(0,0,0,0);  
}

.door-2 {
  margin-right: -59%;
  margin-top: -6%;
}
</style>