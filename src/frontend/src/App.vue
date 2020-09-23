<template>
	<div id="app">
		<div class="header">
			<router-link to="/">
				<h1 class="title">
					<span class="beta-tag">BETA</span>
					<span class="highlight">{</span> StickStats <span class="highlight">}</span>
				</h1>
			</router-link>
		</div>
		<transition @after-enter="animate()">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";

export default {
	name: "App",
	data() {
		return {
			teams: []
		};
	},
	methods: {
		animate: function () {
			this.$nextTick(function () {
				setTimeout(() => {
					let tl = gsap.timeline();
					tl.set(".float-up", { opacity: 0, y: 50 });
					tl.to(".float-up", {
						duration: 0.3,
						opacity: 1,
						y: 0,
						stagger: 0.05,
					});
				}, 1);
			});
		},
	},
	mounted() {
		axios
			.get("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats")
			.then((response) => {
				this.teams = response.data.teams;
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
			});
	},
};
</script>

<style>
* {
	margin: 0px;
	padding: 0px;
}

:root {
	--mainBg: #0a0903;
	--mainText: #fefefe;
	--highlight: #FBFF12;
	--light: #222429;
	font-family: Heebo, Arial, Helvetica, sans-serif;
}

body {
	background: var(--mainBg);
	color: var(--mainText);
}

.highlight {
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

.title{
	display: block;
	position: relative;
}

.beta-tag{
	position: absolute;
	font-size: 15px;
	opacity: 0.3;
	top: 0px;
	right: 0px;
	margin-top: -10px;
	margin-right: 30px;
}

@media screen and (max-width: 1280px) {
	h1 {
		font-size: 40px;
	}

	.header {
		height: 150px;
	}
}
</style>
