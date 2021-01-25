<template>
	<div class="cont">
		<div class="top">
			<h2>Current Season Comparison</h2>
		</div>
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

		<p v-if="teamOne.better && teamTwo.better">
			The {{ teamOne.name }} are outperforming the {{ teamTwo.name }} in
			<b>{{ teamOne.better }}</b> metrics, whereas the {{ teamTwo.teamName }} are better in
			<b>{{ teamTwo.better }}</b
			>.
		</p>

		<div>
			<h3>Filter by category</h3>
		</div>
		<div class="categories">
			<div class="toggler" @click="toggleAll()">Toggle All {{ toggledAll ? "Off" : "On" }}</div>
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

		<div class="flipperCont">
			<div>
				<h3>Show Advantage</h3>
				<flipper-switch
					@flipped="
						() => {
							this.showDiff = !this.showDiff;
						}
					"
					marginBottom="0px"
				/>
			</div>
		</div>

		<div v-if="filterResults.length < 1">
			No stats available, please select some categories above.
		</div>

		<div class="statCont">
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
					<div v-else>Tied</div>
					<div class="advantage" v-if="showDiff && diffs[lab] !== 0">
						+{{ formatStat(Math.abs(diffs[lab]), lab) }}
					</div>
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
import FlipperSwitch from "../components/FlipperSwitch.vue";

export default {
	data() {
		return {
			teamOne: {},
			teamTwo: {},
			diffs: {},
			labels: [],
			selectedCat: {},
			filterResults: [],
			showDiff: false,
			toggledAll: true
		};
	},
	components: { FlipperSwitch },
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
				let modifier = Stat.checkInverse(labels[i]) ? -1 : 1;
				tempDiffs[labels[i]] = modifier * (parseFloat(val) - parseFloat(statTwo[i]));
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
			this.refresh();
			this.animate();
		},
		toggleAll() {
			this.toggledAll = !this.toggledAll;
			for (const c in this.selectedCat) {
				this.selectedCat[c] = this.toggledAll;
			}

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
	flex-direction: column;
	justify-content: center;
	text-align: center;
	align-items: center;
}

.statCont {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.topLogo {
	width: 150px;
}

.topRow,
.categories,
.flipperCont {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 15px 0px;
	flex-grow: 1;
	flex-basis: 100%;
}

h3 {
	margin-bottom: 5px;
}

p {
	width: 600px;
	max-width: 80%;
	margin-bottom: 15px;
}

.categories {
	box-sizing: border-box;
	padding: 5px 0px;
	width: 100%;
	background: var(--mainBg);
	z-index: 5;
	position: sticky;
	top: 0px;
	margin: 0px 0px;
	flex-wrap: wrap;
}

.category,
.toggler {
	font-size: 0.9em;
	font-weight: bold;
	border-radius: 100px;
	cursor: pointer;
	transition: all 0.3s ease;
	margin: 5px 5px;
	padding: 5px 15px;
	background: var(--light);
}

.toggler {
	box-shadow: 0px 0px 0px 2px var(--highlight);
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
	min-height: 300px;
	margin: 15px;
	border-radius: var(--mainBorderRad);
	background: var(--light);
}

.label {
	font-size: 1.2em;
}

.advantage {
	animation: float 0.3s ease forwards;
}

@keyframes float {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0px);
	}
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
	.category,
	.toggler {
		font-size: 0.7em;
	}

	.categories {
		position: static;
		top: 0px;
	}
}
</style>
