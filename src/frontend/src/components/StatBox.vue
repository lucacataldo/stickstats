<template>
	<div class="wrapper">
		<h2>
			{{ $teams.nameTranslations[stat.name] ? $teams.nameTranslations[stat.name] : stat.name }}
		</h2>
		<h1 class="highlight">
			{{ parsedValue }}
		</h1>
	</div>
</template>

<script>
export default {
	name: "StatBox",
	props: {
		stat: Object
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
	}
};
</script>

<style scoped>
h1 {
	font-size: 100px;
}

h2 {
	font-size: 26px;
}

.wrapper {
	padding: 5px;
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
