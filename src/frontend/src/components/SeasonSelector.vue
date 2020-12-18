<template>
	<div class="seasonSelector">
		<div class="selector noselect float-up" @click="isOpen = !isOpen">
			{{ `${$teams.season.slice(0, 4)}-${$teams.season.slice(4, 8)}` }}
			<i class="fa fa-angle-down"></i>
		</div>
		<div class="seasons" v-if="isOpen">
			<i class="fa fa-times close" @click="isOpen = false"></i>
			<h1 class="noselect">Select a season</h1>
			<router-link
				:to="`${toPrefix}/season/${season.slice(0, 4)}`"
				class="seasonResult noselect"
				v-for="season in seasons"
				:key="season"
			>
				{{ `${season.slice(0, 4)}-${season.slice(4, 8)}` }}
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			seasons: [],
			isOpen: false
		};
	},
	props: {
		toPrefix: {
			type: String,
			default: ""
		}
	},
	mounted() {
		let thisYear = new Date().getFullYear();
		for (let i = 0; i < 10; i++) {
			this.seasons[i] = `${thisYear - i - 1}${thisYear - i}`;
		}

		document.addEventListener("click", e => {
			if (e.target !== document.querySelector(".seasonResult") && this.isOpen === true && document.querySelector(".seasons").contains(e.target)) {
				this.isOpen = false;
			}
		});
	}
};
</script>

<style scoped>
.seasonSelector {
	display: inline-block;
	padding: 0px 5px;
	margin: 0px 10px;
	box-shadow: 0px 2px 0px var(--highlight);
}

.close {
	position: absolute;
	top: 20px;
	right: 20px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.close:hover {
	opacity: 0.5;
}

.seasons {
	position: fixed;
	width: 100%;
	z-index: 255;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.9);
	animation: openSeasons 0.7s ease forwards;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

@keyframes openSeasons {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.selector {
	cursor: pointer;
	opacity: 1;
	transition: opacity 0.3s ease;
}

.selector:hover {
	opacity: 0.7;
}

.seasonResult {
	display: block;
	padding: 5px 20px;
	margin: 5px 0px;
	color: var(--mainText);
	border-radius: 20px;
	transition: all 0.3s ease;
}

.seasonResult:hover {
	box-shadow: 0px 0px 0px 2px var(--highlight);
	background: var(--mainBg);
}
</style>
