import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Hirable from "./views/Hirable.vue";
import jokL from "./views/jokL.vue";
import About from "./views/About.vue";
import Ghosts from "./views/Ghosts.vue";
import mCclureEvents from "./views/mCclureEvents.vue";
import Warts from "./views/Warts.vue";
import SwitchArt from "./views/warts/Switch-Art.vue";
import FearIsTheSoul from "./views/warts/FearIsTheSoul.vue";
import Events from "./views/Events.vue";

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
      path: "/mCclureEvents/",
      name: "mCclureEvents",
      component: mCclureEvents
    },
    {
      path: "/mCclureEvents/:user/:id",
      name: "sharedmCclureEvents",
      component: mCclureEvents
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
    {
      path: "/events",
      name: 'events',
      component: Events
    },
    {
      path: "/warts",
      name: 'warts',
      component: Warts
    },
    {
      path: "/switchArt",
      name: 'switchArt',
      component: SwitchArt
    },
    {
      path: "/fearisthesoul",
      name: 'fearisthesoul',
      component: FearIsTheSoul
    },
  ]
});
