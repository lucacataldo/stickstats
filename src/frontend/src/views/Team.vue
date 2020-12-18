<template>
	<div class="container" v-if="team !== undefined">
		<div @click="$router.go(-1)" class="close">
			<i class="fas fa-arrow-left"></i>
		</div>
		<loader v-if="$teams.loading"/>
		<div v-else class="loaded">
			<div class="top">
				<div class="logo float-up">
					<img
						v-bind:src="
							`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
						"
						@error="fallbackImg"
						width="200px"
					/>
				</div>
				<div class="float-up">
					<h1>
						{{ team.name }}
					</h1>
					<p>
						The {{ team.name }} play in the {{ team.division.name }} division of the
						{{ team.conference.name }} conference. They played their first game in
						{{ team.firstYearOfPlay }} and are <span v-if="!team.active">not</span> actively playing
						in the NHL.
					</p>
				</div>
			</div>
			<div class="season">
				<h2>
					<season-selector :toPrefix="`/team/${team.id}`" />
				</h2>
			</div>
			<stat-box
				style="margin-top: 50px"
				class="float-up"
				v-bind:stat="{ name: 'Our Rating', value: team.overall }"
			></stat-box>

			<div class="statsCont">
				<flipper-switch
					class="float-up"
					@flipped="rawOrRankEvent"
					height="20px"
					width="80px"
					v-bind:default-state="true"
					optOne="Raw Data"
					optTwo="Rankings"
				></flipper-switch>
				<div class="stats">
					<stat-box
						class="float-up"
						v-for="(value, statName) in team.teamStats[0].splits[rawOrRank].stat"
						v-bind:key="statName"
						v-bind:stat="{ name: statName, value: value }"
					></stat-box>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FlipperSwitch from "../components/FlipperSwitch";
import SeasonSelector from "../components/SeasonSelector.vue";
import StatBox from "../components/StatBox";
import Loader from "../components/Loader"
export default {
	name: "Team",
	components: {
		FlipperSwitch,
		StatBox,
		SeasonSelector,
		Loader
	},
	data() {
		return {
			team: undefined,
			rawOrRank: 1
		};
	},
	async mounted() {
		window.scrollTo(0, 0);
		if (this.$route.params.seasonId) {
			await this.$teams.getData(parseInt(this.$route.params.seasonId));
		} else {
			await this.$teams.getData();
		}

		this.team = this.$teams.teams.find(t => t.id === parseInt(this.$route.params.id));

		console.log(this.team);

		this.animate();
	},
	methods: {
		rawOrRankEvent: function(state) {
			this.rawOrRank = state ? 1 : 0;
		}
	}
};
</script>

<style scoped>
h1 {
	font-size: 40px;
}

.container {
	box-sizing: border-box;
	padding: 0px 100px;
	background: var(--mainBg);
}

p {
	font-weight: 100;
}

.season {
	position: relative;
	margin: 20px 0px;
	z-index: 255;
}

.top {
	display: flex;
	align-items: center;
}

.logo {
	padding-right: 50px;
}

.close {
	position: fixed;
	background: var(--mainBg);
	border-radius: 100%;
	width: 20px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 10px;
	left: 10px;
	padding: 15px;
	font-size: 30px;
	cursor: pointer;
	z-index: 10;
	transition: background 0.3s ease;
}

.close:hover {
	background: var(--light);
}

.statsCont {
	margin-top: 50px;
}

.stats {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}

@media screen and (max-width: 768px) {
	.container {
		text-align: center;
		padding: 0px 25px;
	}

	.top {
		flex-direction: column;
	}

	.logo {
		padding: 0px;
	}

	.stats {
		text-align: left;
		grid-template-columns: 1fr 1fr;
	}
}
</style>
