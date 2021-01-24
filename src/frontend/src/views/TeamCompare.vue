<template>
	<div class="cont">
		<div class="top">
			<h2>Current Season Comparison</h2>
		</div>
		<div>
			<div class="row">
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${teamOne.id}.svg`
					"
					@error="fallbackImg"
					width="75px"
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
					width="75px"
					:alt="teamTwo.name"
				/>
			</div>
			<div v-for="lab in labels" :key="lab" class="row float-up">
				<div class="label">
					{{ $teams.nameTranslations[lab] }}
				</div>
				<div class="stat one" :class="{ winner: diffs[lab] > 0 }">
					{{ formatStat(teamOne.teamStats[0].splits[0].stat[lab], lab) }}
				</div>
				<div class="stat two" :class="{ winner: diffs[lab] < 0 }">
					{{ formatStat(teamTwo.teamStats[0].splits[0].stat[lab], lab) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
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
			alert("not gucci");
    }
    
    this.animate()
	},
	methods: {
		formatStat(stat, lab) {
			stat = parseFloat(stat);
			if (stat.toFixed !== undefined) {
				if (this.$teams.nameTranslations[lab].indexOf("Perc") > -1) {
					if (stat < 1) {
						return stat * 100 + "%";
					} else {
						return `${stat}%`;
					}
				} else if (this.$teams.nameTranslations[lab].indexOf("Wins ") > -1) {
					return stat * 100 + "%";
				} else {
					return Math.round(stat * 100) / 100;
				}
			} else {
				return stat;
			}
		}
	}
};
</script>

<style scoped>
.cont {
}

.row {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	text-align: center;
	margin: 10px 0px;
	font-weight: bold;
}

.label {
	width: 100%;
	font-size: 1.2em;
}

.winner {
	color: var(--highlight);
}

.stat {
	width: 50%;
	padding: 0px 10px;
	box-sizing: border-box;
	font-size: 2em;
}

.one {
	text-align: right;
}

.two {
	text-align: left;
}

.top {
	text-align: center;
}

@media screen and (max-width: 992px) {
}
</style>
