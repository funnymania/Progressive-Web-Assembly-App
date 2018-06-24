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
      path: "/2-am-slekshun-jokL",
      name: "2am-slekshun-jokL",
      component: jokL
    },
    {
      path: "/status-effeckds",
      name: "StatusEffeckd",
      Componenet: StatusEffeckd
    }
  ]
});
