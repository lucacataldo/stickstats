<template>
	<div v-if="team.teamStats" class="team" :class="oneOrTwo">
		<router-link :to="`/team/${team.id}`" class="row">
			<img
				:src="
					`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
				"
				@error="fallbackImg"
				width="75px"
				:alt="team.name"
			/>
			<h2>
				{{ team.abbreviation }}
			</h2>
		</router-link>
		<div v-for="(stat, lab) in team.teamStats[0].splits[0].stat" :key="lab" class="row">
			<div class="label">
				{{ $teams.nameTranslations[lab] }}
			</div>
			<div class="statNum" :class="{ winner: isWinner(diffs[lab]) }">
				<span>
					{{ formatStat(stat, lab) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		oneOrTwo: String,
		team: Object,
		diffs: Object
	},
	methods: {
		isWinner(val) {
			if (this.oneOrTwo === "one") {
				return val >= 0;
			} else {
				return val <= 0;
			}
		},
		formatStat(stat, lab) {
			stat = parseFloat(stat);
			if (stat.toFixed !== undefined) {
				if (this.$teams.nameTranslations[lab].indexOf("Perc") > -1) {
					if (stat < 1) {
						return stat * 100 + "%";
					} else {
						return `${stat}%`;
					}
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
.team {
	display: flex;
	justify-content: center;
	flex-direction: column;
	text-align: center;
	box-sizing: border-box;
	padding: 10px;
  animation: fadeIn 1s ease forwards;
}

.row {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 1.2em;
	margin: 5px 0px;
}

.one {
	text-align: right;
	grid-area: one;
}

.one .row {
	justify-content: end;
}

.two {
	text-align: left;
	grid-area: two;
}

.two .row {
	flex-direction: row-reverse;
	justify-content: start;
}

.statDiff {
	width: 50px;
}

.statNum {
	width: 150px;
	font-weight: 900;
	font-size: 1.75em;
}

.winner span {
	background: var(--highlight);
	color: var(--light);
	padding: 0px 10px;
	border-radius: 100px;
}
</style>
