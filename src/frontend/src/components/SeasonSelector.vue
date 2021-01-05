<template>
	<div class="seasonSelector">
		<div class="selector noselect" @click="open">
			{{ `${$teams.season.slice(0, 4)}-${$teams.season.slice(4, 8)}` }}
			<i class="fa fa-history"></i>
		</div>
		<div class="seasons" v-if="isOpen">
			<i class="fa fa-times close" @click="close"></i>
			<h1 class="float-up noselect">Select a season</h1>
			<router-link
				:to="`${toPrefix}/season/${season.slice(0, 4)}`"
				class="seasonResult float-up noselect"
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
	watch: {
		isOpen: function(newVal) {
			if (newVal) {
				this.animate(".seasons ");
			}
		}
	},
	mounted() {
		let thisYear = new Date().getFullYear();
		for (let i = 0; i < 10; i++) {
			this.seasons[i] = `${thisYear - i - 1}${thisYear - i}`;
		}

		document.addEventListener("click", e => {
			if (
				e.target !== document.querySelector(".seasonResult") &&
				this.isOpen === true &&
				document.querySelector(".seasons").contains(e.target)
			) {
				this.isOpen = false;
			}
		});
	},
	methods: {
		open: function() {
			this.isOpen = true;
			document.querySelector(".season").style.zIndex = 101;
		},
		close: function() {
			this.isOpen = false;
			document.querySelector(".season").style.zIndex = 10;
		}
	}
};
</script>

<style scoped>
.seasonSelector {
	display: inline-block;
	background: var(--mainBg);
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
	z-index: 100;
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
	opacity: 0;
	animation: fadeIn 0.5s 0.3s ease forwards;
	padding: 0px 5px;
	margin: 0px 10px;
	box-shadow: 0px 2px 0px var(--highlight);
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.selector i {
	transition: transform 0.4s ease;
	transform: scale(0.7);
}

.selector:hover i {
	transform: scale(0.7) rotate(-360deg);
}

.seasonResult {
	display: block;
	padding: 5px 10px;
	margin: 2px 0px;
	color: var(--mainText);
	border-radius: 20px;
	transition: box-shadow 0.3s ease, background 0.3s ease;
}

.seasonResult:hover {
	box-shadow: 0px 0px 0px 2px var(--highlight);
	background: var(--mainBg);
}
</style>
