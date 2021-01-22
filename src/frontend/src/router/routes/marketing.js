export default [
  {
    path: "/wallpapers",
    name: "Wallpapers",
    component: () => import("@/views/Wallpapers.vue")
  },
  {
    path: "/dangle",
    name: "Dangle",
    component: () => import("@/views/Dangle.vue")
  },
]