export default [
  {
    path: "/player/:id",
    name: "View Team Stats",
    component: () => import("@/views/Player.vue")
  },
  {
    path: "/player/:id/season/:seasonId",
    name: "View Team Stats",
    component: () => import("@/views/Player.vue")
  }
]