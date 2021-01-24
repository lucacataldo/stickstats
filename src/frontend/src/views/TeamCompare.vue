<template>
	<div>
		<div class="top">
			<h2>Current Season Comparison</h2>
		</div>
		<div class="cont">
			<div class="topRow">
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${teamOne.id}.svg`
					"
					@error="fallbackImg"
					class="topLogo"
					:alt="teamOne.name"
				/>
				<div>
					V.S.
				</div>
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${teamTwo.id}.svg`
					"
					@error="fallbackImg"
					class="topLogo"
					:alt="teamTwo.name"
				/>
			</div>
			<div v-for="lab in labels" :key="lab" class="box float-up">
				<div class="label">
					{{ $teams.nameTranslations[lab] }}
				</div>
				<div class="diff">
					<img
						v-if="diffs[lab] !== 0"
						:src="
							`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${
								diffs[lab] > 0 ? teamOne.id : teamTwo.id
							}.svg`
						"
						width="75px"
					/>
					<div v-if="diffs[lab] !== 0">
						{{ diffs[lab] > 0 ? "+" : "" }}{{ formatStat(diffs[lab], lab) }}
					</div>
					<div v-else>TIE</div>
				</div>
				<div>
					<div class="stat one" :class="{ winner: diffs[lab] > 0 }">
						{{ formatStat(teamOne.teamStats[0].splits[0].stat[lab], lab) }}
					</div>
					<div class="stat two" :class="{ winner: diffs[lab] < 0 }">
						{{ formatStat(teamTwo.teamStats[0].splits[0].stat[lab], lab) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import RoundNum from "../utils/RoundNum";
import Stat from "../utils/Stat";
export default {
	data() {
		return {
			teamOne: {},
			teamTwo: {},
			diffs: {},
			labels: []
		};
	},
	async mounted() {
		if (this.$route.params.id && this.$route.params.compareId) {
			this.teamOne = (await this.$teams.getTeamSeason(this.$route.params.id)).data.teams[0];
			this.teamTwo = (await this.$teams.getTeamSeason(this.$route.params.compareId)).data.teams[0];

			const labels = Object.keys(this.teamOne.teamStats[0].splits[0].stat);
			const statOne = Object.values(this.teamOne.teamStats[0].splits[0].stat);
			const statTwo = Object.values(this.teamTwo.teamStats[0].splits[0].stat);

			var tempDiffs = {};

			statOne.forEach((val, i) => {
				tempDiffs[`${labels[i]}`] = parseFloat(val) - parseFloat(statTwo[i]);
			});

			this.diffs = tempDiffs;
			this.labels = labels;
		} else {
			alert("Something went wrong while loading comparison data.");
		}

		this.animate();
	},
	methods: {
		formatStatOld(stat, lab) {
			stat = parseFloat(stat);
			if (stat.toFixed !== undefined) {
				if (this.$teams.nameTranslations[lab].indexOf("Perc") > -1) {
					if (stat < 1) {
						return RoundNum(stat * 100, 1) + "%";
					} else {
						return `${RoundNum(stat, 1)}%`;
					}
				} else if (this.$teams.nameTranslations[lab].indexOf("Wins ") > -1) {
					return RoundNum(stat * 100, 1) + "%";
				} else {
					return RoundNum(stat, 0);
				}
			} else {
				return RoundNum(stat, 2);
			}
		},
		formatStat: Stat.formatStat,
		formatName: Stat.formatName
	},
	RoundNum
};
</script>

<style scoped>
.cont {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.topLogo {
	width: 100px;
}

.topRow {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 50px 0px;
	flex-grow: 1;
	flex-basis: 100%;
}

.box {
	box-sizing: border-box;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	margin: 10px 0px;
	font-weight: bold;
	width: 250px;
	height: 250px;
	margin: 15px;
	border-radius: var(--mainBorderRad);
	background: var(--light);
}

.label {
	font-size: 1.2em;
}

.diff {
	font-size: 2.5em;
	display: flex;
}

.winner {
	color: var(--highlight);
}

.stat {
	display: inline-block;
	box-sizing: border-box;
	font-size: 1.8em;
	width: 50%;
	box-sizing: border-box;
}

.stat.one {
	padding-right: 5px;
}

.stat.two {
	padding-left: 5px;
}

.top {
	text-align: center;
}

@media screen and (max-width: 992px) {
}
</style>
