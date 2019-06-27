import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Hirable from "./views/Hirable.vue";
import jokL from "./views/jokL.vue";
import About from "./views/About.vue";
import Ghosts from "./views/Ghosts.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/jokL",
      name: "jokL",
      component: jokL
    },
    {
      path: "/hirable",
      name: "Hirable",
      component: Hirable
    },
    {
      path: "/about",
      name: "About",
      component: About
    },
    {
      path: "/ghosts",
      name: 'ghosts',
      component: Ghosts
    },
  ]
});
