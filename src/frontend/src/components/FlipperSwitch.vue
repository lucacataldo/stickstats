<template>
	<div class="root" :style="{ fontSize: height }">
		{{ optOne }}
		<div class="wrapper" :style="{ height: height, width: width }" @click="flip">
			<div class="switch" :style="{ height: height }" :class="{ flipped: state }"></div>
		</div>
		{{ optTwo }}
	</div>
</template>

<script>
export default {
	name: "FlipperSwitch",
	data() {
		return {
			state: false,
		};
	},
	methods: {
		flip: function () {
			this.state = !this.state;
			this.$emit("flipped", this.state);
		},
	},
	props: {
		height: {
			type: String,
			default: "20px",
		},
		width: {
			type: String,
			default: "100px",
		},
		defaultState: Boolean,
		optOne: {
			type: String,
			default: "",
		},
		optTwo: {
			type: String,
			default: "",
		},
	},
	mounted() {
		this.state = this.defaultState;
	},
};
</script>

<style scoped>
.root {
	display: flex;
	align-items: center;
	justify-content: left;
}

.wrapper {
	margin: 0px 10px;
	display: inline-block;
	width: 100px;
	height: 40px;
	outline: 1px solid var(--highlight);
	cursor: pointer;
}

.switch {
	position: relative;
	width: 50%;
	height: 40px;
	background: var(--highlight);
	margin-left: 0px;
	transition: all 0.2s ease;
}

.switch:hover {
	opacity: 0.8;
}

.flipped {
	margin-left: 50%;
}
</style>
