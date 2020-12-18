<template>
	<div class="wrapper">
		<h2>
			{{ $options.nameTranslations[stat.name] ? $options.nameTranslations[stat.name] : stat.name }}
		</h2>
		<h1 class="highlight">
			{{ stat.value }}
		</h1>
	</div>
</template>

<script>
export default {
	name: "StatBox",
	props: {
		stat: Object
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
		winScoreFirst: "Wins - Scores 1st",
		winOppScoreFirst: "Wins - Opp. Scores 1st",
		winLeadFirstPer: "Wins - Leads 1st",
		winLeadSecondPer: "Wins - Leads 2nd",
		winOutshootOpp: "Wins (Outshot Opp.)",
		winOutshotByOpp: "Wins (Opp. Outshot)",
		faceOffsTaken: "Faceoffs",
		faceOffsWon: "Faceoffs Won",
		faceOffsLost: "Faceoffs Lost",
		faceOffWinPercentage: "Faceoff Win Percentage",
		shootingPctg: "Shooting Percentage",
		savePctg: "Save Percentage",
		savePctRank: "Save Percentage",
		shootingPctRank: "Shooting Percentage"
	}
};
</script>

<style scoped>
h1 {
	font-size: 100px;
}

h2 {
	font-size: 26px;
}

.wrapper {
	margin: 20px 0px;
}

@media screen and (max-width: 768px) {
	h1 {
		font-size: 50px;
	}

	h2 {
		font-size: 24px;
	}
}
</style>
