<template>
	<div>
		<input
			v-model="searchTerm"
			@keyup="search"
			type="text"
			placeholder="Filter teams..."
			class="searchBox"
		/>
		<i class="fas fa-search" @click="search"></i>

		<div class="description float-up">
			StickStats compiles stats and standings from the NHL regular season to offer simple
			ratings on a scale from 1-100. You'll find teams listed from best to worst based on these
			ratings below.
		</div>

		<div class="teamGrid">
			<router-link
				class="team float-up"
				v-for="team in searchResults"
				v-bind:key="team.id"
				v-bind:to="`/team/${team.id}`"
			>
				<h3>{{ team.name }}</h3>
				<img
					class="logo"
					v-bind:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
					"
				/>
				<span class="subtitle">Our Rating</span>
				<span class="rating">
					{{ team.overall }}
				</span>
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: "Home",
	data() {
		return {
			searchTerm: "",
			searchResults: []
		};
	},
	methods: {
		search: function() {
			this.searchResults = this.$parent.teams.filter(
				t => t.name.toLowerCase().indexOf(this.searchTerm.toLowerCase().trim()) === 0
			);

			let more = this.$parent.teams.filter(
				t => t.name.toLowerCase().indexOf(this.searchTerm.toLowerCase().trim()) > 0
			);

			Array.prototype.push.apply(this.searchResults, more);
		}
	},
	mounted() {
		if (this.$parent.teams.length > 0) {
			this.searchResults = this.$parent.teams;
		} else {
			this.$parent.$on("dataLoaded", () => {
				this.searchResults = this.$parent.teams;
			});
		}
	}
};
</script>

<style scoped>
.description {
	width: 50%;
	margin-left: 25%;
	text-align: center;
	font-size: 15px;
}

.teamGrid {
	margin: 0px var(--lrMargins);
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.fa-search {
	position: absolute;
	font-size: 20px;
	margin-left: -50px;
	padding: 10px;
}

.searchBox {
	width: 50%;
	font-size: 20px;
	background: none;
	color: var(--mainText);
	outline: none;
	border-radius: 100px;
	padding: 10px;
	box-sizing: border-box;
	text-align: center;
	margin-left: 25%;
	margin-bottom: 25px;
	border: solid 2px var(--highlight);
	text-transform: capitalize;
	transition: border 0.3s ease;
}

.logo {
	height: 100px;
}

.team {
	position: relative;
	margin: 15px;
	box-sizing: border-box;
	cursor: pointer;
	font-size: 16px;
	text-align: center;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: 900;
	overflow: hidden;
	flex-direction: column;
	padding: 20px;
	transition: background 0.3s ease;
	border-radius: 20px;
}

.team:hover {
	background: var(--light);
}

.team * {
	margin: 5px 0px;
}

.rating {
	line-height: 60px;
	font-size: 50px;
}

@media screen and (max-width: 1280px) {
	.teamGrid {
		grid-template-columns: 1fr 1fr 1fr 1fr;
		margin: 0px 25px;
	}

	.team {
		font-size: 16px;
		margin: 10px;
	}

	.searchBox, .description {
		width: 90%;
		margin-left: 5%;
	}
}

@media screen and (max-width: 768px) {
	.teamGrid {
		grid-template-columns: 1fr 1fr;
		margin: 0px 10px;
	}

	.rating {
		font-size: 40px;
		line-height: 50px;
	}

	.team {
		margin: 5px;
	}
}
</style>
