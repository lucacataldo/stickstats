<template>
	<div class="cont">
		<div class="top">
			<h2>Current Season Comparison</h2>
		</div>
		<compare-team-box oneOrTwo="one" :team="teamOne" :diffs="diffs" />
		<div class="labels">
      <div>

      </div>
			<div v-for="lab in labels" :key="lab">
				{{ lab }}
			</div>
		</div>
		<compare-team-box oneOrTwo="two" :team="teamTwo" :diffs="diffs" />
	</div>
</template>

<script>
import CompareTeamBox from "@/components/CompareTeamBox.vue";

export default {
	data() {
		return {
			teamOne: {},
			teamTwo: {},
			diffs: {},
			labels: []
		};
	},
	components: {
		CompareTeamBox
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
			this.labels = labels.map(l => this.$teams.nameTranslations[l]);
		} else {
			alert("not gucci");
		}
	}
};
</script>

<style scoped>
.cont {
	display: grid;
	grid-template-areas: "top top top" "one lab two";
	grid-template-columns: 2fr 1fr 2fr;
}

.top {
	grid-area: top;
	text-align: center;
}

.labels {
	text-align: center;
	grid-area: lab;
  box-sizing: border-box;
	padding: 10px;
}

.labels > div {
	display: flex;
	flex-direction: row;
	align-items: center;
  justify-content: center;
	font-size: 1.2em;
	padding: 5px 0px;
  box-sizing: border-box;
  height: 70px;
}

@media screen and (max-width: 992px) {
	.cont {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
    font-size: 0.7em;
	}
}
</style>
