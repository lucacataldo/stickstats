<template>
	<div class="container">
		<loader message="Loading player data..." v-if="!player.primaryPosition" />
		<PlayerBio v-else :player="player" :capData="capData" />
		<div class="season">
			<!-- <h2>
				{{ player.fullName }}
				<season-selector :currentSeason="currentSeason" :toPrefix="`/player/${player.id}`" /> Season
				Stats
			</h2> -->
		</div>
		<toaster
			:openProp="isLimited"
			:messageProp="
				`<h3 style='margin-bottom: 10px'>Please Note</h3> This player may have limited stats available for this season.`
			"
			:lengthProp="15000"
		/>

		<!-- 
			
			
			
			





			
			If Skater





			
			
			
			
			
			-->

		<div v-if="isSkater" class="statCont">
			<h2>Player Usage</h2>

			<div class="bigStat">
				<div>
					<h1>{{ currentStats.games }}</h1>
					<h2>games played</h2>
				</div>
			</div>

			<div v-if="currentStats.timeOnIce">
				<h2>{{ currentStats.timeOnIce.split(":")[0] }} Minutes Played</h2>
				<h3>{{ perGame(currentStats.timeOnIce.split(":")[0], true) }}min / game</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						currentStats.evenTimeOnIce.split(':')[0],
						currentStats.powerPlayTimeOnIce.split(':')[0],
						currentStats.shortHandedTimeOnIce.split(':')[0]
					]"
					:labels="['Even Strength', 'Power Play', 'Penalty Kill']"
				/>
			</div>

			<div v-if="advancedStats && viewingThisYear" class="bigStat">
				<div>
					<h1>{{ advancedStats.I_F_shifts }}</h1>
					<h2>shifts</h2>
				</div>
			</div>
		</div>

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

			<div>
				<h2>Shooting Pct: {{ currentStats.shotPct }}%</h2>
				<h3>
					{{ currentStats.shots }} Shots On Goal |
					{{ currentStats.shots - currentStats.goals }} Saved
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[currentStats.goals, currentStats.shots - currentStats.goals]"
					:labels="['Goals', 'Saved Shots']"
				/>
			</div>

			<div v-if="advancedStats && viewingThisYear && advancedStats.I_F_shotAttempts">
				<h2>{{ advancedStats.I_F_shotAttempts }} Shot Attempts</h2>
				<h3>
					{{ advancedStats.I_F_blockedShotAttempts }} Blocked |
					{{ advancedStats.I_F_missedShots }} Miss
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						advancedStats.I_F_shotsOnGoal,
						advancedStats.I_F_blockedShotAttempts,
						advancedStats.I_F_missedShots
					]"
					:labels="['On Goal', 'Blocked', 'Missed']"
				/>
			</div>

			<div v-if="advancedStats && viewingThisYear && advancedStats.I_F_lowDangerShots">
				<h2>Dangerous Shots</h2>
				<h3>
					{{ advancedStats.I_F_highDangerShots }} High |
					{{ advancedStats.I_F_mediumDangerShots }} Med | {{ advancedStats.I_F_lowDangerShots }} Low
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						advancedStats.I_F_highDangerShots,
						advancedStats.I_F_mediumDangerShots,
						advancedStats.I_F_lowDangerShots
					]"
					:labels="['High Danger Shots', 'Medium Danger Shots', 'Low Danger Shots']"
				/>
			</div>
		</div>

		<div v-if="isSkater" class="statCont">
			<h2>
				Defensive Stats / 60
			</h2>

			<div class="bigStat">
				<div>
					<h1>
						{{ (advancedStats.OnIce_A_xGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					</h1>
					<h2>expected goals against</h2>
				</div>
			</div>

			<div>
				<h2>
					{{
						(
							advancedStats.OnIce_A_unblockedShotAttempts /
							(advancedStats.icetime / 60 / 60)
						).toFixed(1)
					}}
					Shots Against
				</h2>
				<h3>
					Low:
					{{
						(advancedStats.OnIce_A_lowDangerShots / (advancedStats.icetime / 60 / 60)).toFixed(1)
					}}
					| Med:
					{{
						(advancedStats.OnIce_A_mediumDangerShots / (advancedStats.icetime / 60 / 60)).toFixed(1)
					}}
					| High:
					{{
						(advancedStats.OnIce_A_highDangerShots / (advancedStats.icetime / 60 / 60)).toFixed(1)
					}}
				</h3>
				<pie-chart
					:colors="[darken(theme, 40), darken(theme, 20), theme]"
					:values="[
						(advancedStats.OnIce_A_lowDangerShots / (advancedStats.icetime / 60 / 60)).toFixed(1),
						(advancedStats.OnIce_A_mediumDangerShots / (advancedStats.icetime / 60 / 60)).toFixed(
							1
						),
						(advancedStats.OnIce_A_highDangerShots / (advancedStats.icetime / 60 / 60)).toFixed(1)
					]"
					:labels="['Low Danger', 'Medium Danger', 'High Danger']"
				/>
			</div>

			<div class="bigStat">
				<div>
					<h1>
						{{
							(advancedStats.shotsBlockedByPlayer / (advancedStats.icetime / 60 / 60)).toFixed(2)
						}}
					</h1>
					<h2>blocked shots</h2>
				</div>
			</div>

			<div class="bigStat">
				<div>
					<h1>
						{{ (advancedStats.I_F_takeaways / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					</h1>
					<h2>takeaways</h2>
				</div>
			</div>

			<div class="bigStat">
				<div>
					<h1>
						{{ (advancedStats.I_F_dZoneGiveaways / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					</h1>
					<h2>d-zone giveaways</h2>
				</div>
			</div>

			<div class="bigStat">
				<div>
					<h1>
						{{ (advancedStats.I_F_giveaways / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					</h1>
					<h2>giveaways</h2>
				</div>
			</div>
		</div>

		<div v-if="isSkater" class="statCont">
			<h2>
				Pest Stats
			</h2>

			<div class="bigStat">
				<div>
					<h1>{{ advancedStats.penalityMinutesDrawn }}</h1>
					<h2>penalty min drawn</h2>
				</div>
			</div>

			<div class="bigStat">
				<div>
					<h1>{{ advancedStats.I_F_hits }}</h1>
					<h2>hits</h2>
				</div>
			</div>

			<div class="bigStat">
				<div>
					<h1>{{ advancedStats.penalityMinutes }}</h1>
					<h2>penalty minutes</h2>
				</div>
			</div>
		</div>

		<!-- 
			
			
			





			
			
			If Goalie 
			
			





			
			
			
			-->
		<div v-if="isGoalie" class="statCont">
			<h2>
				Basic Stats
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

			<div v-if="advancedStats && advancedStats.xGoals" class="bigStat">
				<div>
					<h1>
						{{ ((advancedStats.xGoals - advancedStats.goals) / 6).toFixed(2) }}
					</h1>
					<h2>Wins Above Replacement</h2>
				</div>
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

		<div v-if="isGoalie" class="statCont">
			<h2>
				Goals Against
			</h2>

			<div>
				<h2>xGAA: {{ (advancedStats.xGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}</h2>
				<h3>
					Low:
					{{ (advancedStats.lowDangerxGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					| Med:
					{{ (advancedStats.mediumDangerxGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					| High:
					{{ (advancedStats.highDangerxGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						(advancedStats.lowDangerxGoals / (advancedStats.icetime / 60 / 60)).toFixed(2),
						(advancedStats.mediumDangerxGoals / (advancedStats.icetime / 60 / 60)).toFixed(2),
						(advancedStats.highDangerxGoals / (advancedStats.icetime / 60 / 60)).toFixed(2)
					]"
					:labels="['Low Danger xGAA', 'Medium Danger xGAA', 'High Danger xGAA']"
				/>
			</div>

			<div v-if="advancedStats && advancedStats.goals" class="bigStat">
				<div>
					<h1>
						{{ (advancedStats.goals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					</h1>
					<h2>
						Actual GAA <br />
						(
						{{ advancedStats.goals > advancedStats.xGoals ? "+" : "" }}
						{{
							(
								advancedStats.goals / (advancedStats.icetime / 60 / 60) -
								advancedStats.xGoals / (advancedStats.icetime / 60 / 60)
							).toFixed(2)
						}}
						)
					</h2>
				</div>
			</div>

			<div>
				<h2>GAA Breakdown</h2>
				<h3>
					Low:
					{{ (advancedStats.lowDangerGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					| Med:
					{{ (advancedStats.mediumDangerGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
					| High:
					{{ (advancedStats.highDangerGoals / (advancedStats.icetime / 60 / 60)).toFixed(2) }}
				</h3>
				<pie-chart
					:colors="[theme, darken(theme, 20), darken(theme, 40)]"
					:values="[
						(advancedStats.lowDangerGoals / (advancedStats.icetime / 60 / 60)).toFixed(2),
						(advancedStats.mediumDangerGoals / (advancedStats.icetime / 60 / 60)).toFixed(2),
						(advancedStats.highDangerGoals / (advancedStats.icetime / 60 / 60)).toFixed(2)
					]"
					:labels="['Low Danger GAA', 'Medium Danger GAA', 'High Danger GAA']"
				/>
			</div>
		</div>

		<br />

		<div style="text-align: center;">
			Advanced Stats courtesy of
			<a target="_blank" class="niceLink" href="https://moneypuck.com"
				>MoneyPuck <i class="fas fa-link"></i>
			</a>
		</div>
	</div>
</template>

<script>
import Loader from "../components/Loader";
import PieChart from "../components/PieChart";
import { darken } from "khroma";
import Toaster from "../components/Toaster";
// import SeasonSelector from "../components/SeasonSelector";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import PlayerBio from "../components/PlayerBio.vue";

export default {
	data() {
		return {
			player: {},
			stats: {},
			index: 0,
			capData: {},
			advancedStats: {}
		};
	},
	props: {
		theme: String
	},
	components: {
		Loader,
		PieChart,
		Toaster,
		// SeasonSelector,
		PlayerBio
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
				return this.stats[this.index].season;
			} catch (error) {
				return "00000000";
			}
		},
		viewingThisYear: function() {
			try {
				let now = new Date().getFullYear();
				if (this.currentSeason.indexOf(now) === 0 || this.currentSeason.indexOf(now) === 4) {
					return true;
				} else {
					return false;
				}
			} catch (error) {
				return false;
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
		this.capData = await this.$players.getCapData(this.player);
		this.advancedStats = await this.$players.getAdvancedStats(
			this.player.id,
			this.isGoalie ? "goalie" : "skater"
		);

		if (this.$route.params.seasonId) {
			try {
				const seasonId = this.$route.params.seasonId + (parseInt(this.$route.params.seasonId) + 1);
				this.index = this.stats.findIndex(t => t.season === seasonId);
			} catch (error) {
				this.index = 0;
			}
		}
		window.scrollTo(0, 0);
	},
	methods: {
		darken,
		findFlagUrlByIso3Code,
		perGame(val, round = false) {
			try {
				val = parseInt(val);
				let avg = val / this.currentStats.games;

				if (typeof round === "boolean" && round) {
					return Math.round(avg);
				} else if (typeof round === "number") {
					return avg.toFixed(round);
				}
			} catch (error) {
				return 0;
			}
		}
	}
};
</script>

<style scoped>
.container {
	box-sizing: border-box;
	padding: 0px var(--lrMargins);
	background: var(--mainBg);
}

.season {
	margin-top: 50px;
	text-align: center;
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
	width: 33%;
}

.statCont canvas {
	margin-top: 10px;
}

.statCont .bigStat {
	box-sizing: border-box;
	padding: 10px;
	min-height: 275px;
	font-size: 1.2em;
	border-radius: 50px;
	background: var(--highlight);
	transition: background 0.3s ease;
	color: var(--mainBg);
	display: flex;
	justify-content: center;
	align-items: center;
	border: solid 5px var(--mainBg);
}

.statCont .bigStat h3 {
	opacity: 0.5;
}

.statCont .bigStat h1 {
	font-size: 3em;
}

@media screen and (max-width: 768px) {
	.statCont > div {
		margin-bottom: 50px;
		width: 100%;
	}
}
</style>
