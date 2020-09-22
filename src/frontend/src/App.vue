<template>
	<div id="app">
		<div class="header">
			<router-link to="/">
				<h1><span class="highlight">{</span> HockeyMan Stats <span class="highlight">}</span></h1>
			</router-link>
		</div>
		<transition name="route">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "App",
	data() {
		return {
			teams: [],
			searchTerm: "",
			searchResults: []
		};
	},
	methods: {
		search: function() {
			this.searchResults = this.teams.filter(
				t => t.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
			);
		}
	},
	mounted() {
		axios.get("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats").then(response => {
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

			this.$emit("dataLoaded");
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
	--mainBg: #0e0f11;
	--mainText: #fefefe;
	--highlight: #28f7d1;
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

.route-enter-active,
.route-enter-active {
	transition: opacity 1s ease;
}

.route-enter, .route-leave-to{
	opacity: 0;
}


@media screen and (max-width: 1280px) {
	h1{
		font-size: 40px;
	}

	.header{
		height: 150px;
	}

	.subtitle{
		display: block;
		font-size: 18px;
		line-height: 18px;
	}
}
</style>
