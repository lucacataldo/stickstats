import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import teams from "./stores/teams";
import gsap from "gsap";

Vue.prototype.$teams = teams;

Vue.mixin({
  data() {
    return {
      animateStarted: false,
    }
  },
  methods: {
    animate: function () {
      if (!this.animateStarted) {
        this.animateStarted = true
        setTimeout(() => {
          console.log("animate()");
          let tl = gsap.timeline();
          tl.set(".float-up", { opacity: 0, y: 50 });
          tl.to(".float-up", {
            duration: 0.3,
            opacity: 1,
            y: 0,
            stagger: 0.05
          });
          this.animateStarted = false
        }, 300);
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
