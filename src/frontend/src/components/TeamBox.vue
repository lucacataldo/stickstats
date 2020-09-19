<template>
	<div v-if="visible" class="container">
		<div
			class="close"
			@click="
				visible = false;
				rawOrRank = 1;
			"
		>
			X
		</div>
		<h1>
			{{ team.name }}
		</h1>
		<p>
			The {{ team.name }} play in the {{ team.division.name }} division of the
			{{ team.conference.name }} conference. They played their first game in {{ team.firstYearOfPlay }} and are
			<span v-if="!team.active">not</span> actively playing in the NHL.
		</p>

		<div class="statsCont">
			<stat-box v-bind:stat="{ name: 'HockeyMan Rank', value: '1st' }"></stat-box>
			<flipper-switch
				@flipped="rawOrRankEvent"
				height="20px"
				width="80px"
				v-bind:default-state="true"
				optOne="Raw Data"
				optTwo="Rankings"
			></flipper-switch>
			<div class="stats">
				<stat-box
					v-for="(value, statName) in team.teamStats[0].splits[rawOrRank].stat"
					v-bind:key="statName"
					v-bind:stat="{ name: statName, value: value }"
				></stat-box>
			</div>
		</div>
	</div>
</template>

<script>
import FlipperSwitch from "./FlipperSwitch";
import StatBox from "./StatBox";
export default {
	name: "TeamView",
	data() {
		return {
			team: {},
			visible: false,
			rawOrRank: 1
		};
	},
	components: {
		FlipperSwitch,
		StatBox
	},
	methods: {
		rawOrRankEvent: function(state) {
			this.rawOrRank = state ? 1 : 0;
		},
		open: function(passed) {
			this.team = passed;
			var sorted = this.team.teamStats[0].splits[1].stat;
			sorted = Object.entries(sorted).sort((a, b) => {
				return parseInt(b[1].slice(0, -2)) < parseInt(a[1].slice(0, -2));
			});

			this.team.teamStats[0].splits[1].stat = Object.fromEntries(sorted);
			this.visible = true;
		}
	}
};
</script>

<style scoped>
h1 {
	font-size: 40px;
}

.container {
	position: fixed;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 50px;
	background: var(--mainBg);
	top: 0px;
	left: 0px;
	overflow-y: auto;
}

p {
	font-weight: 100;
}

.close {
	position: absolute;
	right: 50px;
	top: 50px;
	font-size: 30px;
	cursor: pointer;
}

.statsCont {
	margin-top: 50px;
}

.stats {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}
</style>
