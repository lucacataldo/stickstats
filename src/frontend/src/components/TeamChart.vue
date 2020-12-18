<template>
	<div>
		<loader message="Loading historical ratings..." v-if="loading" />
		<div v-else class="chartTitle">
			Historical ratings for the past
			<input min="2" max="100" v-model.number="range" id="chartRange" type="number" />
			years
		</div>
		<canvas id="chartCanvas"> </canvas>
	</div>
</template>

<script>
import Chart from "chart.js";
import Loader from "../components/Loader";
export default {
	data() {
		return {
			history: [],
			range: 10,
			loading: false
		};
	},
	components: {
		Loader
	},
	props: {
		teamId: Number,
		theme: String
	},
	chartObj: {},
	timer: 0,
	watch: {
		theme: function() {
			this.refresh();
		},
		range: async function(newVal) {
      clearTimeout(this.timer);
      if(!newVal){
        return
      }
			this.timer = setTimeout(async () => {
				if (newVal > 100 || newVal < 2) {
					alert("Sorry, range must be between 2-100 years");
					this.range = 10;
					return;
				}
				this.chartObj.destroy();
				await this.getData();
				this.refresh();
			}, 500);
		}
	},
	methods: {
		refresh: function() {
			this.chartObj.destroy();
			this.renderChart();
		},
		renderChart: function() {
			let ctx = document.getElementById("chartCanvas").getContext("2d");
			let color = this.theme;

			this.chartObj = new Chart(ctx, {
				type: "line",
				data: {
					labels: Object.keys(this.history),
					datasets: [
						{
							backgroundColor: "rgba(0, 0, 0, 0)",
							borderColor: color,
							data: Object.values(this.history),
							lineTension: 0.4,
							pointHitRadius: 15,
							pointRadius: 5,
							borderWidth: 4,
							pointBackgroundColor: color,
							pointHoverBackgroundColor: "#111111",
							pointHoverRadius: 10
						}
					]
				},
				options: {
					legend: {
						display: false
					},
					title: {
						display: false
					},
					tooltips: {
						enabled: true,
						titleAlign: "center",
						titleFontSize: 18,
						titleFontColor: "#111111",
						bodyFontSize: 18,
						bodyFontColor: "#111111",
						displayColors: false,
						cornerRadius: 20,
						xPadding: 15,
						yPadding: 15,
						backgroundColor: color
					},
					spanGaps: true,
					maintainAspectRatio: false
				}
			});
		},
		getData: async function() {
			this.loading = true;
			this.history = await this.$teams.getHistoricalRatings(this.teamId, this.range);
			this.loading = false;
		}
	},
	async mounted() {
		await this.getData();
		this.renderChart();
	}
};
</script>

<style scoped>
#chartCanvas {
	height: 60vh !important;
}

.chartTitle {
	font-size: 18px;
	margin-top: -20px;
	margin-bottom: 20px;
	text-align: center;
}

#chartRange {
	border: none;
	outline: none;
	color: var(--mainText);
	text-align: center;
	-webkit-appearance: none;
	-moz-appearance: textfield;
	width: 50px;
	box-shadow: 0px 2px 0px var(--highlight);
	padding: 5px;
	box-sizing: border-box;
	font-size: 20px;
	margin: 0;
	background: none;
	transition: all 0.3s ease;
}

#chartRange:focus {
	box-shadow: 0px 5px 0px var(--highlight);
}
</style>
