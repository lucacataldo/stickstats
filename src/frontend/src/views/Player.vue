<template>
	<div class="container">
		<loader message="Loading player data..." v-if="!player.primaryPosition" />
		<div v-else class="top">
			<img
				class="playerPhoto"
				:src="`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`"
				:alt="player.fullName"
			/>
			<div class="info">
				<h1>
					<span class="position">{{ player.primaryPosition.abbreviation }}</span>
					{{ player.fullName }} #{{ player.primaryNumber }}
				</h1>
				<div class="attributes">
					<div>
						<h2>
							<i :class="{ leftHanded: player.shootsCatches == 'L' }" class="far fa-hand-paper"></i>
							{{ player.shootsCatches }}
						</h2>
					</div>

					<div>
						<h2>
							<i class="fa fa-arrows-alt-v"></i>
							{{ player.height }}
						</h2>
					</div>

					<div>
						<h2>
							<img
								height="20px"
								:src="`https://restcountries.eu/data/${player.birthCountry.toLowerCase()}.svg`"
								alt=""
							/>
							{{ player.birthCity }}, {{ player.birthStateProvince }} {{ player.birthCountry }}
						</h2>
					</div>

					<div>
						<h2>
							<i class="fa fa-birthday-cake"></i>
							{{ new Date(player.birthDate).toDateString().slice(4) }}
							({{ player.currentAge }}yrs old)
						</h2>
					</div>

					<div>
						<h2>
							<i class="fa fa-weight"></i>
							{{ player.weight }}lbs
						</h2>
					</div>
				</div>
			</div>
			<router-link v-if="player.currentTeam" :to="`/team/${player.currentTeam.id}`">
				<img
					v-bind:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${player.currentTeam.id}.svg`
					"
					@error="fallbackImg"
					width="200px"
				/>
			</router-link>
		</div>
		<div class="statCont">
      <h2>
        Stats
      </h2>
			<canvas id="offChartCanvas"> </canvas>
			<canvas id="toiChartCanvas"> </canvas>
		</div>
	</div>
</template>

<script>
import Chart from "chart.js";
import Loader from "../components/Loader";
export default {
	data() {
		return {
			player: {},
			stats: {},
			index: 0
		};
	},
	props: {
		theme: String
	},
	components: {
		Loader
	},
	computed: {
		currentStats: function() {
			return this.stats[this.index].stat;
		}
	},
	async mounted() {
		this.player = (await this.$players.getPlayerInfo(this.$route.params.id)).data.people[0];
		this.stats = await this.$players.getPlayerStats(this.$route.params.id);

		this.drawOffChart();
	},
	methods: {
		isMobile: function() {
			return window.innerWidth < 512;
		},
		drawOffChart: function() {
			let ctx = document.getElementById("offChartCanvas").getContext("2d");

			let offOnly = this.currentStats;

      delete offOnly.shifts;
      delete offOnly.timeOnIce;
      delete offOnly.powerPlayTimeOnIce;
      delete offOnly.evenTimeOnIce;
      delete offOnly.shortHandedTimeOnIce;

			let labels = Object.keys(offOnly);

			let values = Object.values(offOnly);

			new Chart(ctx, {
				type: this.isMobile() ? "bar" : "horizontalBar",
				data: {
					labels: labels,
					datasets: [
						{
							data: values,
							backgroundColor: this.theme
						}
					]
				},
				options: {
					maintainAspectRatio: true,
					aspectRatio: this.isMobile() ? 0.8 : 1.5,
					legend: {
						display: false
					},
					scales: {
						xAxes: [
							{
								ticks: {
									suggestedMin: 0,
									stepsize: 1,
									maxTicksLimit: 200,
									fontColor: "rgba(255, 255, 255, 0.6)"
								}
							}
						],
						yAxes: [
							{
								ticks: {
									fontColor: "#ffffff"
								}
							}
						]
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.container {
	box-sizing: border-box;
	padding: 0px var(--lrMargins);
	background: var(--mainBg);
}

.top {
	align-items: center;
	display: flex;
}

.playerPhoto {
	margin: 0px 50px;
	border-radius: 200px;
}

i.leftHanded {
	transform: scaleX(-1);
}

.attributes {
	padding-top: 10px;
	display: flex;
	flex-wrap: wrap;
}

.attributes > div {
	margin-right: 30px;
}

.position {
	padding: 0px 10px;
	border-radius: 20px;
	background: var(--highlight);
	color: var(--mainBg);
}

.info {
	flex-grow: 1;
}

.statCont {
	margin-top: 50px;
}

@media screen and (max-width: 768px) {
	.top {
		flex-direction: column;
		text-align: center;
	}

	.top > * {
		margin: 20px 0px;
	}

	.attributes {
		justify-content: center;
	}
}
</style>
