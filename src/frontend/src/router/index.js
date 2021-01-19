import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import gsap from "gsap"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/wallpapers",
    name: "Wallpapers",
    component: () => import("../views/Wallpapers.vue")
  },
  {
    path: "/season/:seasonId",
    name: "Season",
    component: Home
  },
  {
    path: "/team/:id",
    name: "View Team Stats",
    component: () => import("../views/Team.vue")
  },
  {
    path: "/team/:id/schedule",
    name: "Team Schedule",
    component: () => import("../views/TeamSchedule.vue")
  },
  {
    path: "/team/:id/season/:seasonId",
    name: "View Team Stats",
    component: () => import("../views/Team.vue")
  },
  {
    path: "/player/:id",
    name: "View Team Stats",
    component: () => import("../views/Player.vue")
  },
  {
    path: "/player/:id/season/:seasonId",
    name: "View Team Stats",
    component: () => import("../views/Player.vue")
  },
  {
    path: "*",
    name: "404",
    component: () => import("../views/404.vue")
  }
];

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
