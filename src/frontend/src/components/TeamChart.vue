<template>
	<div>
		<loader v-if="loading" />
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
	watch: {
		theme: function() {
      this.renderChart()
		}
	},
	methods: {
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
						display: true,
						text: "Historical Ratings",
						fontSize: 18
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
					maintainAspectRatio: false,
					aspectRatio: 2
				}
			});
		}
	},
	async mounted() {
		this.loading = true;
		this.history = await this.$teams.getHistoricalRatings(this.teamId);
		this.loading = false;
		this.renderChart();
	}
};
</script>

<style scoped></style>
