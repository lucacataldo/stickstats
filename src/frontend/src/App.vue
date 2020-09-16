<template>
	<div id="app">
		<label for="teamSearch">Search teams </label>
		<input type="text" name="teamSearch" v-model="searchTerm" v-on:keyup="search">
		<ul>
			<li v-for="team in searchResults" v-bind:key="team.id">
				{{ team.name }}
			</li>
		</ul>
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
	components: {},
	methods: {
		search: function(){
			this.searchResults = this.teams.filter(t => t.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
		}
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
	--light: #ededed;
}
</style>
