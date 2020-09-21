<template>
	<div id="app">
		<div class="searchBar">
			<label for="teamSearch">Search Teams</label>
			<br />
			<input
				type="text"
				name="teamSearch"
				v-model="searchTerm"
				v-on:keyup="search"
				placeholder="ex. Toronto Maple Leafs"
			/>
		</div>

		<ul class="searchResults">
			<li v-for="team in searchResults" v-bind:key="team.id" @click="openTeam(team)">
				{{ team.name }} | {{team.overall}}
			</li>
		</ul>

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
				var num = 0;
				for (const rank in stats) {
					sum += parseInt(stats[rank].slice(0, -2));
					num++;
				}
				this.teams[i].overall =  (sum/num).toFixed(1);
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
	--mainBg: #16181a;
	--mainText: #efefef;
	--highlight: #a3cb38;
	--light: #222429;
	font-family: Heebo, Arial, Helvetica, sans-serif;
}

body {
	background: var(--mainBg);
	color: var(--mainText);
}
.searchBar {
	font-size: 25px;
	text-align: center;
	padding: 20px;
}

.searchResults {
	list-style: none;
	text-align: center;
	width: 50%;
	margin-left: 25%;
}

.searchResults li {
	padding: 5px;
	margin: 2px;
	cursor: pointer;
}

.searchResults li:hover {
	background: var(--light);
}

.searchBar input {
	color: var(--mainText);
	width: 50%;
	font-size: 20px;
	border: none;
	background: var(--light);
	text-align: center;
	padding: 5px;
	margin: 5px;
	box-shadow: 0px 2px 0px var(--highlight);
	text-transform: capitalize;
}
</style>
