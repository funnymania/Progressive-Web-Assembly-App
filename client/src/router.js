import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import jokL from "./views/jokL.vue";
import StatusEffeckd from "./views/StatusEffeckd.vue";


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
      path: "/statuseffeckds",
      name: "StatusEffeckd",
      Componenet: StatusEffeckd
    }
  ]
});
