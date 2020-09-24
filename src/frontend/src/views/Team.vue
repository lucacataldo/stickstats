<template>
	<div class="container" v-if="team !== undefined">
		<router-link to="/" class="close">
			<i class="fas fa-arrow-left"></i>
		</router-link>
		<div class="top">
			<div class="logo float-up">
				<img
					v-bind:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
					"
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
					{{ team.firstYearOfPlay }} and are <span v-if="!team.active">not</span> actively
					playing in the NHL.
				</p>
			</div>
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
</template>

<script>
import FlipperSwitch from "../components/FlipperSwitch";
import StatBox from "../components/StatBox";
export default {
	name: "Team",
	components: {
		FlipperSwitch,
		StatBox
	},
	data() {
		return {
			team: undefined,
			rawOrRank: 1
		};
	},
	mounted() {
		if (this.$parent.teams.length > 0) {
			this.loadTeam();
		} else {
			this.$parent.$on("dataLoaded", this.loadTeam);
		}
	},
	methods: {
		loadTeam: function() {
			this.team = this.$parent.teams.find(element => {
				return element.id === parseInt(this.$route.params.id);
			});

			// var sorted = this.team.teamStats[0].splits[1].stat;
			// sorted = Object.entries(sorted).sort((a, b) => {
			// 	return parseInt(b[1].slice(0, -2)) < parseInt(a[1].slice(0, -2));
			// });
			// this.team.teamStats[0].splits[1].stat = Object.fromEntries(sorted);

			window.scrollTo(0, 0);
		},
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
	z-index: 10;
}

p {
	font-weight: 100;
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
	top: 0px;
	left: 0px;
	padding: 15px;
	font-size: 30px;
	cursor: pointer;
	z-index: 10;
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
