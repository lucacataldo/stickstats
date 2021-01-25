<template>
	<div>
		<div class="top">
			<h2>Current Season Comparison</h2>
		</div>
		<div class="cont">
			<div class="topRow">
				<div style="text-align: center">
					<router-link :to="`/team/${teamOne.id}/season/${$teams.season.slice(0, 4)}`">
						<img
							:src="
								`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${teamOne.id}.svg`
							"
							@error="fallbackImg"
							class="topLogo"
							:alt="teamOne.name"
						/>
					</router-link>
					<h2>
						{{ teamOne.overall }}
					</h2>
				</div>

				<div>
					V.S.
				</div>

				<div style="text-align: center">
					<router-link :to="`/team/${teamTwo.id}/season/${$teams.season.slice(0, 4)}`">
						<img
							:src="
								`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${teamTwo.id}.svg`
							"
							@error="fallbackImg"
							class="topLogo"
							:alt="teamTwo.name"
						/>
					</router-link>
					<h2>
						{{ teamTwo.overall }}
					</h2>
				</div>
			</div>
			<div>
				<h3>Filter by category</h3>
			</div>
			<div class="categories">
				<div
					class="category"
					v-for="cat in categories()"
					:class="{ on: selectedCat[cat.name] }"
					:key="cat.name"
					@click="toggleCategory(cat.name)"
				>
					{{ cat.displayName }}
				</div>
			</div>
			<div v-for="lab in filterResults" :key="lab" class="box float-up">
				<div class="label">
					{{ formatName(lab) }}
				</div>

				<div class="diff">
					<img
						v-if="diffs[lab] !== 0"
						:src="
							`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${
								diffs[lab] > 0 ? teamOne.id : teamTwo.id
							}.svg`
						"
					/>
					<div v-if="diffs[lab] !== 0">+{{ formatStat(Math.abs(diffs[lab]), lab) }}</div>
					<div v-else>Tied</div>
				</div>

				<div class="stats">
					<div>
						<div class="statLabel one">
							{{ teamOne.abbreviation }}
						</div>
						<div class="statLabel two">
							{{ teamTwo.abbreviation }}
						</div>
					</div>
					<div>
						<div class="stat one" :class="{ winner: diffs[lab] > 0, loser: diffs[lab] < 0 }">
							{{ formatStat(teamOne.teamStats[0].splits[0].stat[lab], lab) }}
						</div>
						<div class="stat two" :class="{ winner: diffs[lab] < 0, loser: diffs[lab] > 0 }">
							{{ formatStat(teamTwo.teamStats[0].splits[0].stat[lab], lab) }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import RoundNum from "../utils/RoundNum";
import Stat from "../utils/Stat";
import Vue from "vue";
export default {
	data() {
		return {
			teamOne: {},
			teamTwo: {},
			diffs: {},
			labels: [],
			selectedCat: {},
			filterResults: []
		};
	},
	async mounted() {
		if (this.$route.params.id && this.$route.params.compareId) {
			this.teamOne = (await this.$teams.getTeamSeason(this.$route.params.id)).data.teams[0];
			this.teamTwo = (await this.$teams.getTeamSeason(this.$route.params.compareId)).data.teams[0];

			this.teamOne.overall = this.$teams.rate(this.teamOne);
			this.teamTwo.overall = this.$teams.rate(this.teamTwo);

			const labels = Object.keys(this.teamOne.teamStats[0].splits[0].stat);
			const statOne = Object.values(this.teamOne.teamStats[0].splits[0].stat);
			const statTwo = Object.values(this.teamTwo.teamStats[0].splits[0].stat);

			var tempDiffs = {};

			this.teamOne.better = 0;
			this.teamTwo.better = 0;

			statOne.forEach((val, i) => {
				tempDiffs[labels[i]] = parseFloat(val) - parseFloat(statTwo[i]);
				if (tempDiffs[labels[i]] > 0) {
					this.teamOne.better++;
				} else if (tempDiffs[labels[i]] < 0) {
					this.teamTwo.better++;
				}
			});

			this.diffs = tempDiffs;
			this.labels = labels;
		} else {
			alert("Something went wrong while loading comparison data.");
		}

		var tempCat = {};

		if (this.$route.query.filters) {
			try {
				tempCat = JSON.parse(this.$route.query.filters);
			} catch (error) {
				console.log("Error parsing filters query", error);
				Stat.categories.forEach(cat => {
					tempCat[cat.name] = true;
				});
			}
		} else {
			Stat.categories.forEach(cat => {
				tempCat[cat.name] = true;
			});
		}

		this.selectedCat = tempCat;

		this.refresh();

		this.animate();
	},
	methods: {
		categories() {
			return Stat.categories;
		},
		toggleCategory(name) {
			Vue.set(this.selectedCat, name, !this.selectedCat[name]);
			this.$router.replace({
				path: this.$route.path,
				query: { filters: JSON.stringify(this.selectedCat) }
			});
			this.refresh();
			this.animate();
		},
		refresh() {
			this.filterResults = this.labels.filter(lab => {
				const categories = Stat.categories;
				var retVal = false;

				categories.forEach(cat => {
					if (this.selectedCat[cat.name] && Stat.checkFilter(lab, cat.name)) {
						retVal = true;
					}
				});

				return retVal;
			});
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

.topRow,
.categories {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 50px 0px;
	flex-grow: 1;
	flex-basis: 100%;
}

.categories {
	margin: 15px 0px;
	flex-wrap: wrap;
}

.category {
	font-weight: bold;
	border-radius: 100px;
	cursor: pointer;
	transition: all 0.3s ease;
	margin: 10px 5px;
	padding: 10px 15px;
	background: var(--light);
}

.category:hover {
	box-shadow: 0px 0px 0px 3px var(--highlight);
}

.category:active {
	opacity: 0.5;
}

.category.on {
	background: var(--highlight);
	color: var(--light);
}

.box {
	box-sizing: border-box;
	padding: 20px 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	margin: 10px 0px;
	font-weight: bold;
	width: 250px;
	height: 300px;
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
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.diff img {
	width: 100px;
}

.stats {
	width: 100%;
}

.winner {
	opacity: 1;
	color: var(--highlight);
}

.loser {
	opacity: 0.4;
}

.stat,
.statLabel {
	display: inline-block;
	box-sizing: border-box;
	font-size: 1.8em;
	width: 50%;
	box-sizing: border-box;
}

.statLabel {
	font-weight: normal;
	font-size: 1.5em;
}

.one {
	padding-right: 5px;
	text-align: right;
}

.two {
	padding-left: 5px;
	text-align: left;
}

.top {
	text-align: center;
}

@media screen and (max-width: 992px) {
}
</style>
