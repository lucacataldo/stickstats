import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
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
	{
		path: "/team/:id",
		name: "View Team Stats",
		component: () => import("../views/Team.vue")
	},
	{
		path: "/team/:id/season/:seasonId",
		name: "View Team Stats",
		component: () => import("../views/Team.vue")
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
