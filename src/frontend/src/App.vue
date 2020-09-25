<template>
	<div v-bind:style="{ '--highlight': themeColour }" id="app">
		<toaster ref="toaster"></toaster>
		<div class="header">
			<router-link to="/">
				<h1 class="title">
					<span class="beta-tag">BETA</span>
					<span class="highlight">{</span> StickStats <span class="highlight">}</span>
				</h1>
			</router-link>
			<settings-popup></settings-popup>
		</div>
		<transition @after-enter="animate()">
			<router-view></router-view>
		</transition>

		<div class="copyright">
			{{ copyright }}
			<br />
			<a href="https://cataldo.ca">
				Created by <b>Cataldo <i class="fas fa-external-link-alt"></i></b>
			</a>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";
import SettingsPopup from "./components/SettingsPopup";
import Toaster from "./components/Toaster";

export default {
	name: "App",
	data() {
		return {
			teams: [],
			copyright: "",
			themeColour: "#fbff12"
		};
	},
	components: {
		SettingsPopup,
		Toaster
	},
	methods: {
		animate: function() {
			this.$nextTick(function() {
				setTimeout(() => {
					let tl = gsap.timeline();
					tl.set(".float-up", { opacity: 0, y: 50 });
					tl.to(".float-up", {
						duration: 0.3,
						opacity: 1,
						y: 0,
						stagger: 0.05
					});
				}, 1);
			});
		},
		toggleSettings: function() {}
	},
	mounted() {
		axios.get("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats").then(response => {
			this.teams = response.data.teams;
			this.copyright = response.data.copyright;
			// Inject overall rating to each team
			this.teams.forEach((team, i) => {
				const stats = team.teamStats[0].splits[1].stat;
				var sum = 0;
				var num = 1;
				for (const rank in stats) {
					sum += parseInt(stats[rank].slice(0, -2));
					num++;
				}
				this.teams[i].overall = ((100 * (num - sum / num)) / num).toFixed(1);
			});

			this.teams.sort((a, b) => {
				return b.overall - a.overall;
			});

			this.animate();
			this.$emit("dataLoaded");

			if (localStorage.themeColour) {
				this.themeColour = localStorage.themeColour;
			}

			this.$refs.toaster.toast({
				message: `
					Hey, thanks for checking out StickStats. We're currently in <b>BETA</b> meaning 
					that there might be some hiccups and bugs along the way. If you do happen 
					to come accross a bug or have a suggestion, feel free to send us a message 
					<b><a href="https://cataldo.ca#chat">here <i class="fas fa-external-link-alt"></i></a> </b> 
					and check back often for new features!`,
				length: 30000
			});
		});
	}
};
</script>

<style>
* {
	margin: 0px;
	padding: 0px;
}

:root {
	--mainBg: #04030a;
	--mainText: #fefefe;
	--light: hsl(249, 10%, 9%);
	--lrMargins: 100px;
	font-family: Heebo, Arial, Helvetica, sans-serif;
}

body {
	background: var(--mainBg);
	color: var(--mainText);
}

.highlight {
	transition: color 0.4s ease;
	color: var(--highlight);
}

.subtitle {
	display: block;
	font-weight: 100;
	opacity: 0.3;
}

h1 {
	font-size: 60px;
}

.header {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
}

a:link,
a:visited,
:target {
	color: var(--mainText);
	text-decoration: none;
	border: none;
	outline: none;
}

.title {
	display: block;
	position: relative;
}

.beta-tag {
	position: absolute;
	font-size: 15px;
	opacity: 0.3;
	top: 0px;
	right: 0px;
	margin-top: -10px;
	margin-right: 30px;
}

.copyright {
	text-align: center;
	margin: 20px var(--lrMargins);
	font-size: 13px;
	opacity: 0.5;
}

@media screen and (max-width: 1280px) {
	:root {
		--lrMargins: 25px;
	}

	h1 {
		font-size: 40px;
	}

	.header {
		height: 150px;
	}
}

@media screen and (max-width: 768px) {
	:root {
		--lrMargins: 10px;
	}
}
</style>
