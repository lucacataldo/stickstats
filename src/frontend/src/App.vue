<template>
	<div id="app">
		<div class="header">
			<h1> <span class="highlight">{</span> HockeyMan Stats <span class="highlight">}</span></h1>
		</div>
		<router-view></router-view>
		<div class="teamGrid">
			<div class="team" v-for="team in teams" v-bind:key="team.id" @click="openTeam(team)">
				<div class="teamMask">
					<div>
						<h3>{{team.name}}</h3>
						<img
							v-bind:src="
								`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
							"
						/>
						<span class="subtitle">HockeyMan Score</span>
						<span class="rating">
							{{ team.overall }}
						</span>
					</div>
				</div>
			</div>
		</div>
		<team-box ref="teamBox"></team-box>
	</div>
</template>

<script>
import axios from "axios";
import TeamBox from "./components/TeamBox";
export default {
	name: "App",
	data() {
		return {
			teams: [],
			searchTerm: "",
			searchResults: []
		};
	},
	components: {
		TeamBox
	},
	methods: {
		search: function() {
			this.searchResults = this.teams.filter(
				t => t.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
			);
		},
		openTeam: function(team) {
			this.$refs.teamBox.open(team);
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
				this.teams[i].overall = (100 * (num - sum / num) / num).toFixed(1);
			});

			this.teams.sort((a, b) => {
				return b.overall - a.overall;
			});
			console.log(this.teams);
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
	--highlight: #28F7D1;
	--light: #222429;
	font-family: Heebo, Arial, Helvetica, sans-serif;
}

body {
	background: var(--mainBg);
	color: var(--mainText);
}

.highlight{
	color: var(--highlight);
}

.subtitle{
	font-weight: 100;
	line-height: 5px;
	opacity: 0.3;
}

h1{
	font-size: 60px;
}

.header {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
}

.teamGrid {
	margin: 0px 100px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.team {
	position: relative;
	margin: 15px;
	box-sizing: border-box;
	cursor: pointer;
	font-size: 20px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.6s ease;
	font-weight: 900;
	overflow: hidden;
	background: var(--light);
	border-radius: 15px;
}

.teamMask {
	width: 100%;
	height: 100%;
	padding: 25px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.3s ease;
	z-index: 2;
	color: var(--mainText);
}

.rating {
	line-height: 60px;
	font-size: 50px;
}



@media screen and (max-width: 1280px) {
	.teamGrid{
		grid-template-columns: 1fr 1fr 1fr 1fr;
		margin: 0px 25px;
	}
}

@media screen and (max-width: 768px) {
	.teamGrid{
		grid-template-columns: 1fr 1fr;
		margin: 0px 10px;
	}
}
</style>
