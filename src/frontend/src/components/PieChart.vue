<template>
	<canvas ref="chart"></canvas>
</template>

<script>
import Chart from "chart.js";
import { lighten } from "khroma";
export default {
	props: {
		values: {
			type: Array,
			default: () => [3, 8]
		},
		labels: {
			type: Array,
			default: () => ["1", "2", "3", "4"]
		},
		colors: {
			type: Array
		}
	},
	mounted() {
		this.draw();
	},
	chart: null,
	watch: {
		values: function() {
			this.refresh();
		}
	},
	methods: {
		draw: function() {
			let ctx = this.$refs.chart;
			this.chart = new Chart(ctx, {
				type: "doughnut",
				data: {
					datasets: [
						{
							data: this.values,
							backgroundColor: this.colors,
							hoverBackgroundColor: lighten(this.colors[0], 20),
							borderColor: "#000000"
						}
					],
					labels: this.labels
				},
				options: {
					reponsive: true,
					legend: {
						display: false
					},
					tooltips: {
						displayColors: false,
						caretSize: 3,
						xPadding: 10,
						yPadding: 10,
						bodyFontStyle: "bold",
						bodyFontSize: 18,
						position: "nearest",
						backgroundColor: "#111111",
						cornerRadius: 5
					},
					cutoutPercentage: 30
				}
			});
		},
		refresh: function() {
			this.chart.destroy();
			this.draw();
		}
	}
};
</script>

<style scoped></style>
