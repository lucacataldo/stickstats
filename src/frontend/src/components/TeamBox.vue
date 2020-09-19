<template>
	<div v-if="visible" class="container">
		<div class="close" @click="visible = false">X</div>
		<h1>
			{{ team.name }}
		</h1>
		<h2>est. {{ team.firstYearOfPlay }}</h2>
	</div>
</template>

<script>
export default {
	name: "TeamView",
	data() {
		return {
			team: {},
			visible: false,
		};
	},
};
</script>

<style scoped>
.container {
	position: fixed;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 50px;
	background: var(--light);
	top: 0px;
	left: 0px;
}

.close {
	position: absolute;
	right: 50px;
	top: 50px;
	font-size: 30px;
	cursor: pointer;
}
</style>
