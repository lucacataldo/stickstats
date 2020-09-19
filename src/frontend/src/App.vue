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
			<li
				v-for="team in searchResults"
				v-bind:key="team.id"
				@click="openTeam(team)"
			>
				{{ team.name }}
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
			searchResults: [],
		};
	},
	components: {
		TeamBox,
	},
	methods: {
		search: function () {
			this.searchResults = this.teams.filter(
				(t) =>
					t.name
						.toLowerCase()
						.indexOf(this.searchTerm.toLowerCase()) > -1
			);
		},
		openTeam: function (team) {
			this.$refs.teamBox.team = team;
			this.$refs.teamBox.visible = true;
		},
	},
	mounted() {
		axios
			.get("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats")
			.then((response) => {
				this.teams = response.data.teams;
				console.log(response);
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
	--highlight: #38ada9;
	--light: #e9e9e9;
	font-family: Arial, Helvetica, sans-serif;
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
	width: 50%;
	font-size: 20px;
	border: none;
	background: var(--light);
	text-align: center;
	padding: 5px;
	margin: 5px;
	box-shadow: 0px 2px 0px var(--highlight);
}
</style>
