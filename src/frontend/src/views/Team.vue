<template>
	<div class="container" v-if="team !== undefined">
		<div @click="$router.go(-1)" class="close">
			<i class="fas fa-arrow-left"></i>
		</div>
		<jump-menu
			:items="[
				{ name: 'Info', tag: '#info' },
				{ name: 'Roster', tag: '#roster' },
				{ name: 'History', tag: '#history' },
				{ name: 'Team Stats', tag: '#teamStats' }
			]"
		/>
		<compare-team-button />
		<div class="season">
			<h2>
				<season-selector :currentSeason="$teams.season" :toPrefix="`/team/${team.id}`" />
			</h2>
		</div>
		<loader v-if="$teams.loading" />
		<div v-else class="loaded">
			<div class="top" id="info">
				<div class="logo float-up">
					<img
						v-bind:src="
							`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
						"
						@error="fallbackImg"
						width="150px"
					/>
				</div>
				<div class="float-up team-info">
					<h1>
						{{ team.name }}
					</h1>
					<p>
						The {{ team.name }} play in the {{ team.division.name }} division of the
						{{ team.conference.name }} conference. They played their first game in
						{{ team.firstYearOfPlay }} and are <span v-if="!team.active">not</span> actively playing
						in the NHL.
					</p>
				</div>
				<stat-box
					style="margin-top: 50px"
					class="float-up"
					id="our-rating"
					v-bind:stat="{ name: 'Our Rating', value: team.overall }"
				/>
			</div>

			<team-roster :teamId="team.id" :season="$route.params.seasonId" id="roster" />

			<team-chart :theme="theme" :teamId="team.id" id="history" />

			<div class="statsCont" id="teamStats">
				<h1>Team Stats</h1>
				<div>
					<input class="searchBox" v-model="filterTerm" placeholder="filter stats" type="text" />
				</div>
				<flipper-switch
					class="float-up"
					@flipped="rawOrRankEvent"
					height="20px"
					width="80px"
					v-bind:default-state="false"
					optOne="Raw Data"
					optTwo="Rankings"
				/>
				<div class="stats">
					<stat-box
						class="float-up"
						v-for="stat in sorted.filter(s => {
							return (
								s.name.toLowerCase().indexOf(filterTerm.toLowerCase()) > -1 ||
								formatName(s.name)
									.toLowerCase()
									.indexOf(filterTerm.toLowerCase()) > -1
							);
						})"
						v-bind:key="stat.name + rawOrRank + filterTerm"
						v-bind:stat="stat"
						v-bind:rawrank="rawOrRank"
					></stat-box>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FlipperSwitch from "../components/FlipperSwitch";
import SeasonSelector from "../components/SeasonSelector.vue";
import StatBox from "../components/StatBox";
import Loader from "../components/Loader";
import TeamChart from "../components/TeamChart.vue";
import TeamRoster from "../components/TeamRoster.vue";
import JumpMenu from "../components/JumpMenu.vue";
import CompareTeamButton from "@/components/CompareTeamButton.vue";
import Stat from "../utils/Stat";
export default {
	name: "Team",
	components: {
		FlipperSwitch,
		StatBox,
		SeasonSelector,
		Loader,
		TeamChart,
		TeamRoster,
		JumpMenu,
		CompareTeamButton
	},
	data() {
		return {
			team: undefined,
			rawOrRank: 0,
			filterTerm: ""
		};
	},
	computed: {
		sorted: function() {
			if (this.team && this.rawOrRank) {
				let statArray = this.team.teamStats[0].splits[this.rawOrRank].stat;
				let newArray = [];

				let sortedKeys = Object.keys(statArray).sort((a, b) => {
					return parseInt(statArray[a].slice(0, -2)) - parseInt(statArray[b].slice(0, -2));
				});

				sortedKeys.forEach((key, i) => {
					newArray[i] = {
						name: key,
						value: statArray[key]
					};
				});

				return newArray;
			} else if (this.team && !this.rawOrRank) {
				return Object.keys(this.team.teamStats[0].splits[this.rawOrRank].stat).map(key => {
					return { name: key, value: this.team.teamStats[0].splits[this.rawOrRank].stat[key] };
				});
			} else {
				return [];
			}
		}
	},
	props: {
		theme: String
	},
	async beforeCreate() {
		window.scrollTo(0, 0);
		if (this.$route.params.seasonId) {
			await this.$teams.getData(parseInt(this.$route.params.seasonId));
		} else {
			this.$router.replace();
			await this.$teams.getData();
		}

		this.team = this.$teams.teams.find(t => t.id === parseInt(this.$route.params.id));
		document.title = `StickStats | ${this.team.name} ${this.$route.params.seasonId} Stats, Analytics and Ratings`;
	},
	methods: {
		rawOrRankEvent: function(state) {
			this.rawOrRank = state ? 1 : 0;
			this.animate(".stats ");
		},
		formatName: Stat.formatName
	},
	watch: {
		filterTerm: function() {
			this.animate(".stats ");
		}
	}
};
</script>

<style scoped>
h1 {
	font-size: 40px;
}

.container {
	box-sizing: border-box;
	padding: 0px var(--lrMargins);
	background: var(--mainBg);
}

p {
	font-weight: 100;
}

.season {
	position: relative;
	margin: 20px 0px;
	text-align: center;
}

.top {
	display: flex;
	align-items: center;
}

.team-info {
	flex-grow: 1;
	padding: 0px 20px;
}

#our-rating {
	text-align: center;
	min-width: 150px;
	margin-right: 20px;
}

.close {
	position: absolute;
	background: var(--light);
	border-radius: 100%;
	width: 20px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 10px;
	left: 10px;
	padding: 15px;
	font-size: 30px;
	cursor: pointer;
	z-index: 21;
	transition: all 0.3s ease;
}

.close:hover {
	background: var(--highlight);
	color: var(--light);
}

.close:active {
	transform: scale(1.2);
}

.statsCont {
  margin-top: 50px;
	text-align: center;
}

.stats {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}

.searchBox {
	margin: 20px 0px;
}

@media screen and (max-width: 1280px) {
	.top {
		flex-direction: column;
	}
}

@media screen and (max-width: 768px) {
	.container {
		text-align: center;
	}

	.top {
		flex-direction: column;
	}
	.stats {
		grid-template-columns: 1fr 1fr;
	}
}

@media (max-width: 576px) {
	.stats {
		text-align: center;
		grid-template-columns: 1fr;
	}
}
</style>
