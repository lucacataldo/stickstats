<template>
	<div class="container">
		<loader message="Loading player data..." v-if="!player.primaryPosition" />
		<div v-else class="top">
			<img
				class="playerPhoto"
				:src="`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`"
				:alt="player.fullName"
			/>
			<div class="info">
				<h1>
					<span class="position">{{ player.primaryPosition.abbreviation }}</span>
					{{ player.fullName }} #{{ player.primaryNumber }}
				</h1>
				<div class="attributes">
					<div>
						<h2>
							<i :class="{ leftHanded: player.shootsCatches == 'L' }" class="far fa-hand-paper"></i>
							{{ player.shootsCatches }}
						</h2>
					</div>

					<div>
						<h2>
							<i class="fa fa-arrows-alt-v"></i>
							{{ player.height }}
						</h2>
					</div>

					<div>
						<h2>
							<img
								height="20px"
								:src="`https://restcountries.eu/data/${player.birthCountry.toLowerCase()}.svg`"
								alt=""
							/>
							{{ player.birthCity }}, {{ player.birthStateProvince }} {{ player.birthCountry }}
						</h2>
					</div>

					<div>
						<h2>
							<i class="fa fa-birthday-cake"></i>
							{{ new Date(player.birthDate).toDateString().slice(4) }}
							({{ player.currentAge }}yrs old)
						</h2>
					</div>

					<div>
						<h2>
							<i class="fa fa-weight"></i>
							{{ player.weight }}lbs
						</h2>
					</div>
				</div>
			</div>
			<router-link v-if="player.currentTeam" :to="`/team/${player.currentTeam.id}`">
				<img
					v-bind:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${player.currentTeam.id}.svg`
					"
					@error="fallbackImg"
					width="200px"
				/>
			</router-link>
		</div>
		<div class="season">
			<h2>{{ player.fullName }} {{ currentSeason }} Season Stats</h2>
		</div>
		<toaster
			:openProp="isLimited"
			:messageProp="
				`<h3 style='margin-bottom: 10px'>Please Note</h3> This player may have limited stats available for this season.`
			"
			:lengthProp="15000"
		/>

		<div v-if="isSkater" class="statCont">
			<h2>
				Offensive Stats
			</h2>
			<div>
				<h2>{{ currentStats.points }} Points</h2>
				<h3>{{ currentStats.goals }} Goals | {{ currentStats.assists }} Assists</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20)]"
					:values="[currentStats.goals, currentStats.assists]"
					:labels="['Goals', 'Assists']"
				/>
			</div>

			<div>
				<h2>{{ currentStats.goals }} Goals</h2>
				<h3>
					{{ currentStats.goals - (currentStats.powerPlayGoals + currentStats.shortHandedGoals) }}
					EV | {{ currentStats.powerPlayGoals }} PP | {{ currentStats.shortHandedGoals }} SH
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						currentStats.goals - (currentStats.powerPlayGoals + currentStats.shortHandedGoals),
						currentStats.powerPlayGoals,
						currentStats.shortHandedGoals
					]"
					:labels="['Even Strength', 'PowerPlay', 'ShortHanded']"
				/>
			</div>

			<div>
				<h2>{{ currentStats.shotPct }}% Shooting</h2>
				<h3>
					{{ currentStats.shots }} Shots | {{ currentStats.shots - currentStats.goals }} Saved
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[currentStats.goals, currentStats.shots - currentStats.goals]"
					:labels="['Goals', 'Saved Shots']"
				/>
			</div>

			<div>
				<h2>Point Breakdown</h2>
				<h3>
					{{
						currentStats.points - (currentStats.powerPlayPoints + currentStats.shortHandedPoints)
					}}
					EV | {{ currentStats.powerPlayPoints }} PP | {{ currentStats.shortHandedPoints }} SH
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						currentStats.points - (currentStats.powerPlayPoints + currentStats.shortHandedPoints),
						currentStats.powerPlayPoints,
						currentStats.shortHandedPoints
					]"
					:labels="['Even Strength', 'PowerPlay', 'ShortHanded']"
				/>
			</div>
		</div>
		<div v-if="isGoalie" class="statCont">
			<h2>
				Goalie Stats
			</h2>
			<div>
				<h2>Wins: {{ Math.round(1000 * (currentStats.wins / currentStats.games)) / 10 }}%</h2>
				<h3>{{ currentStats.wins }} Wins | {{ currentStats.games }} Games</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20)]"
					:values="[currentStats.wins, currentStats.games - currentStats.wins]"
					:labels="['Wins', 'Losses']"
				/>
			</div>

			<div>
				<h2>Save Pct: {{ currentStats.savePercentage }}</h2>
				<h3>
					{{ currentStats.shotsAgainst }} Shots | {{ currentStats.saves }} Saves |
					{{ currentStats.goalsAgainst }} GA
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20)]"
					:values="[currentStats.saves, currentStats.goalsAgainst]"
					:labels="['Saves', 'Goals Against']"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import Loader from "../components/Loader";
import PieChart from "../components/PieChart";
import { darken } from "khroma";
import Toaster from "../components/Toaster";
export default {
	data() {
		return {
			player: {},
			stats: {},
			index: 0
		};
	},
	props: {
		theme: String
	},
	components: {
		Loader,
		PieChart,
		Toaster
	},
	computed: {
		currentStats: function() {
			try {
				return this.stats[this.index].stat;
			} catch (error) {
				return {};
			}
		},
		currentSeason: function() {
			try {
				return `${this.stats[this.index].season.slice(0, 4)}-${this.stats[this.index].season.slice(
					4,
					8
				)}`;
			} catch (error) {
				return "SEASON";
			}
		},
		isLimited: function() {
      let len = Object.keys(this.currentStats).length;
			return this.currentStats && 2 < len && len < 8;
		},
		isSkater: function() {
			if (this.player.primaryPosition) {
				return (
					this.player.primaryPosition.type === "Forward" ||
					this.player.primaryPosition.type === "Defenseman"
				);
			} else {
				return false;
			}
		},
		isGoalie: function() {
			if (this.player.primaryPosition) {
				return this.player.primaryPosition.type === "Goalie";
			} else {
				return false;
			}
		}
	},
	async mounted() {
		this.player = (await this.$players.getPlayerInfo(this.$route.params.id)).data.people[0];
		this.stats = await this.$players.getPlayerStats(this.$route.params.id);

		window.scrollTo(0, 0);
	},
	methods: {
		darken
	}
};
</script>

<style scoped>
.container {
	box-sizing: border-box;
	padding: 0px var(--lrMargins);
	background: var(--mainBg);
}

.top {
	align-items: center;
	display: flex;
}

.playerPhoto {
	margin: 0px 50px;
	border-radius: 200px;
}

i.leftHanded {
	transform: scaleX(-1);
}

.attributes {
	padding-top: 10px;
	display: flex;
	flex-wrap: wrap;
}

.attributes > div {
	margin-right: 30px;
}

.position {
	padding: 0px 10px;
	border-radius: 20px;
	background: var(--highlight);
	color: var(--mainBg);
}

.season {
	margin-top: 50px;
	text-align: center;
}

.info {
	flex-grow: 1;
}

.statCont {
	text-align: center;
	margin-top: 50px;
	position: relative;
	display: flex;
	flex-wrap: wrap;
}

.statCont > h2 {
	font-size: 30px;
	flex-basis: 100%;
	flex-grow: 1;
	margin-bottom: 25px;
}

.statCont > div {
	margin-bottom: 50px;
	width: 50%;
}

.statCont canvas {
	margin-top: 10px;
}

@media screen and (max-width: 768px) {
	.top {
		flex-direction: column;
		text-align: center;
	}

	.top > * {
		margin: 20px 0px;
	}

	.attributes {
		justify-content: center;
	}

	.statCont > div {
		margin-bottom: 50px;
		width: 100%;
	}
}
</style>
