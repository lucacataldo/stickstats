import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import gsap from "gsap"

// Route Groups
import marketing from "@/router/routes/marketing"
import teams from "@/router/routes/teams"
import players from "@/router/routes/players"
import special from "@/router/routes/reports"

Vue.use(VueRouter);

var routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/season/:seasonId",
    name: "Season",
    component: Home
  },
];

routes = routes.concat(marketing)
routes = routes.concat(teams)
routes = routes.concat(players)
routes = routes.concat(special)

routes.push({
  path: "*",
  name: "404",
  component: () => import("@/views/404.vue")
})


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async function (to, from, next) {
  to;
  from;

  let tl = gsap.timeline();
  tl.set(".float-up", { opacity: 1 });
  tl.to(".float-up, canvas", {
    duration: 0.2,
    opacity: 0
  });
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 200);
  })
  next()
})

export default router;
