<template>
	<div class="wrapper">
		<h2>
			{{ formatName(stat.name) }}
		</h2>
		<h1 class="highlight">
			{{ formatStat(stat.value, stat.name, rawrank) }}<span v-if="type == 'perc'">%</span>
		</h1>
		<div v-if="type === 'perc'" class="perc">
			<div class="bar" :style="`width:${stat.value}%`"></div>
		</div>
	</div>
</template>

<script>
import Stat from "../utils/Stat";
export default {
	name: "StatBox",
	props: {
		stat: Object,
		rawrank: Number,
		type: String
	},
	computed: {
		parsedValue: function() {
			let stringy = this.stat.value.toString();
			if (stringy.indexOf("t") > -1 || stringy.indexOf("d") > -1) {
				return stringy;
			} else {
				return Math.round(parseFloat(this.stat.value) * 100) / 100;
			}
		}
	},
	methods: {
		formatName: Stat.formatName,
		formatStat: Stat.formatStat
	}
};
</script>

<style scoped>
h1 {
	font-size: 80px;
}

h2 {
	font-size: 26px;
}

.wrapper {
	padding: 5px;
	position: relative;
}

.perc {
	position: relative;
	height: 10px;
	width: 70%;
	left: 15%;
	border: solid 3px var(--highlight);
	background: var(--mainBg);
	border-radius: 10px;
}

.bar {
	position: relative;
	top: 0px;
	height: 10px;
	background: var(--highlight);
}

@media screen and (max-width: 992px) {
	h1 {
		font-size: 70px;
	}

	h2 {
		font-size: 22px;
	}
}

@media screen and (max-width: 768px) {
	h1 {
		font-size: 50px;
	}

	h2 {
		font-size: 18px;
	}
}
</style>
