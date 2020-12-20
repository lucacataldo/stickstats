import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import teams from "./stores/teams";
import gsap from "gsap";

Vue.prototype.$teams = teams;

Vue.mixin({
  methods: {
    animate: function () {
      let tl = gsap.timeline();
      tl.set(".float-up", { opacity: 0, y: 50 });
      tl.to(".float-up", {
        duration: 0.3,
        opacity: 1,
        y: 0,
        stagger: 0.05
      });
    },
    animateOut: function () {
      let tl = gsap.timeline();
      tl.set(".float-up", { opacity: 1, y: 0 });
      tl.to(".float-up", {
        duration: 0.2,
        opacity: 0,
        y: -50
      });

      alert("hi")
    },
    fallbackImg: function (e) {
      e.target.src = "/notFound.svg";
    }
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
