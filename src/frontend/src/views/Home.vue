<template>
	<div>
		<div>
			<h2 class="seasonCont">
				<season-selector />
			</h2>
		</div>
		<input v-model="searchTerm" type="text" placeholder="Search (teams or players)" class="searchBox" />
		<i class="fas fa-search"></i>

		<div class="description">
			StickStats compiles stats and standings from the NHL regular season to offer simple ratings on
			a scale from 1-100. You'll find teams listed from best to worst based on these ratings below.
			Select your favourite hockey team to view their in-depth stats as well as historical rankings.
		</div>

		<div class="teamGrid">
			<loader message="Working hard, please wait..." v-if="$teams.loading" />
			<router-link
				class="team float-up"
				v-else
				v-bind:key="team.id"
				v-bind:to="`/team/${team.id}/season/${$teams.season.slice(0, 4)}`"
				v-for="team in $teams.teams.filter(searchAlgorithm)"
			>
				<h3>{{ team.name }}</h3>
				<img
					class="logo"
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
					"
					:alt="`${team.name} logo`"
					@error="fallbackImg"
				/>
				<span class="subtitle">Our Rating</span>
				<span class="rating">
					{{ team.overall }}
				</span>
			</router-link>
		</div>
		<loader v-if="this.playersLoading" message="Loading player results..." />
		<div v-if="playerResults.length && !this.playersLoading" class="playerResults">
			<h1>Players</h1>
			<player-card
				v-for="player in playerResults"
				:key="player.id"
				:player="{ person: { fullName: player.name, id: player.id } }"
				:float="false"
			/>
		</div>
	</div>
</template>

<script>
import SeasonSelector from "../components/SeasonSelector.vue";
import Loader from "../components/Loader.vue";
import PlayerCard from "../components/PlayerCard.vue";

export default {
	components: {
		SeasonSelector,
		Loader,
		PlayerCard
	},
	name: "Home",
	data() {
		return {
			searchTerm: "",
			searchResults: [],
			playerResults: [],
			playersLoading: false
		};
	},
	methods: {
		searchAlgorithm: function(t) {
			let term = this.searchTerm.toLowerCase();
			let bool = t.name.toLowerCase().indexOf(term) > -1 || t.abbreviation.toLowerCase() === term;
			return bool;
		}
	},
	async mounted() {
		document.title = "StickStats | Hockey Stats and Analytics";
		if (this.$route.params.seasonId) {
			await this.$teams.getData(parseInt(this.$route.params.seasonId));
		} else {
			await this.$teams.getData();
		}

		this.animate(".teamGrid ");
	},
	timer: 0,
	watch: {
		searchTerm: function() {
			this.playersLoading = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(async () => {
				if (this.searchTerm.length) {
					let res = this.$players.searchPlayers(this.searchTerm);
					this.playerResults = res;
				} else {
					this.playerResults = [];
				}
				this.playersLoading = false;
			}, 1000);

			this.animate(".teamGrid ");
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
	margin-top: 3px;
	margin-left: -55px;
	padding: 15px;
}

.seasonCont {
	text-align: center;
	margin-bottom: 25px;
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
	transition: background 0.4s ease, box-shadow 0.5s ease;
	border-radius: 20px;
}

.team:hover {
	background: var(--light);
}

.team:focus {
	box-shadow: 0px 0px 0px 5px var(--highlight);
}

.team * {
	margin: 5px 0px;
}

.rating {
	line-height: 60px;
	font-size: 50px;
}

.playerResults {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.playerResults h1 {
	text-align: center;
	flex-basis: 100%;
	flex-grow: 1;
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

	.searchBox,
	.description {
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
