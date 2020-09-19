<template>
	<div class="wrapper">
		<h2>
			{{ $options.nameTranslations[stat.name] ? $options.nameTranslations[stat.name] : stat.name }}
		</h2>
		<h1>
			{{ stat.value }}
		</h1>
	</div>
</template>

<script>
export default {
	name: "StatBox",
	props: {
		stat: Object,
	},
	nameTranslations: {
		gamesPlayed: "Games Played",
		wins: "Wins",
		losses: "Losses",
		ot: "Overtime Wins",
		pts: "Points",
		ptPctg: "Points Percentage",
		goalsPerGame: "Goals / Game",
		goalsAgainstPerGame: "Goals Against / Game",
		evGGARatio: "Even Strength GGA Ratio",
		powerPlayPercentage: "PP Percentage",
		powerPlayGoals: "PP Goals",
		powerPlayGoalsAgainst: "PP Goals Against",
		powerPlayOpportunities: "PP Opportunities",
		penaltyKillOpportunities: "PK Opportunities",
		penaltyKillPercentage: "PK Percentage",
		shotsPerGame: "Shots / Game",
		shotsAllowed: "Shots Allowed",
		winScoreFirst: "Wins After Scoring 1st",
		winOppScoreFirst: "Wins After Opp. Scores 1st",
		winLeadFirstPer: "Wins After Leading 1st",
		winLeadSecondPer: "Wins After Leading 2nd",
		winOutshootOpp: "Wins (Outshot Opp.)",
		winOutshotByOpp: "Wins (Opp. Outshot)",
		faceOffsTaken: "Faceoffs",
		faceOffsWon: "Faceoffs Won",
		faceOffsLost: "Faceoffs Lost",
		faceOffWinPercentage: "Faceoff Win Percentage",
		shootingPctg: "Shooting Percentage",
		savePctg: "Save Percentage",
		savePctRank: "Save Percentage Rank",
		shootingPctRank: "Shooting Percentage Rank",
	},
};
</script>

<style scoped>
h1 {
	color: var(--highlight);
	font-size: 100px;
}

.wrapper {
	margin: 15px 0px;
}
</style>
