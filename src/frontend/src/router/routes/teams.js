export default [
  {
    path: "/team/:id",
    name: "View Team Stats",
    component: () => import("@/views/Team.vue")
  },
  {
    path: "/team/:id/season/:seasonId",
    name: "View Team Stats",
    component: () => import("@/views/Team.vue")
  },
  {
    path: "/team/:id/compare/:compareId",
    name: "View Team Stats",
    component: () => import("@/views/TeamCompare.vue")
  },
]