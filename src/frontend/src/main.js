import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import teams from "./stores/teams";
import players from "./stores/players";
import gsap from "gsap";
import AsyncAssets from "./utils/AsyncAssets"

Vue.prototype.$teams = teams;
Vue.prototype.$players = players;

AsyncAssets()

Vue.mixin({
  data() {
    return {
      animateStarted: false,
    }
  },
  methods: {
    animate: function (specify = "") {
      if (!this.animateStarted) {
        this.animateStarted = true
        setTimeout(() => {
          let tl = gsap.timeline();
          tl.set(specify + ".float-up", { opacity: 0, y: 50 });
          tl.to(specify + ".float-up", {
            duration: 0.3,
            opacity: 1,
            y: 0,
            stagger: 0.03
          });
          this.animateStarted = false
        }, 100);
      }
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
