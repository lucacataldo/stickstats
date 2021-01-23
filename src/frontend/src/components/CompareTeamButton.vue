<template>
	<div class="cont" :class="{ open: isOpen }">
		<div class="button" @click="open">
			<i class="fa fa-exchange-alt"></i>
		</div>
		<div class="selectorCont" v-if="isOpen">
			<h3>Compare With</h3>
			<input ref="inp" placeholder="Search..." type="text" v-model="searchTerm" />
			<div class="results">
				<router-link v-for="team in results" :key="team.id" :to="`../compare/${team.id}`">
					<img
						class="resultImg"
						:src="
							`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
						"
					/>
					<span>
						{{ team.teamName }}
					</span>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isOpen: false,
			searchTerm: "",
			results: []
		};
	},
	mounted() {
		this.results = this.$teams.teams;
	},
	methods: {
		open() {
			this.isOpen = !this.isOpen;
			setTimeout(() => {
				this.$refs.inp.focus();
			}, 100);
		}
	},
	watch: {
		searchTerm(newVal) {
			if (newVal) {
				this.results = this.$teams.teams.filter(
					t => t.name.toLowerCase().indexOf(newVal.toLowerCase()) > -1
				);
			} else {
				this.results = this.$teams.teams;
			}
		}
	}
};
</script>

<style scoped>
.cont {
	z-index: 19;
	position: fixed;
	width: 60px;
	height: 60px;
	bottom: 10px;
	right: 10px;
}

.cont.open {
	width: 300px;
	height: 400px;
}

.button {
	position: absolute;
	bottom: 5px;
	right: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px !important;
	box-sizing: border-box;
	width: 50px;
	height: 50px;
	background: var(--light);
	color: var(--mainText);
}

.button:hover {
	background: var(--highlight);
	color: var(--light);
}

.selectorCont {
	width: 100%;
	height: 100%;
	position: absolute;
	background: var(--light);
	box-sizing: border-box;
	padding: 20px;
	border-radius: var(--mainBorderRad);
	text-align: center;
	display: flex;
	flex-direction: column;
  font-weight: 900;
}

input {
	margin: 10px 0px;
	width: 100%;
	height: 30px;
	box-sizing: border-box;
	border: none;
	outline: none;
	border-radius: 100px;
	text-align: center;
	background: rgba(255, 255, 255, 0.05);
	color: var(--mainText);
	font-weight: 900;
	flex-shrink: 0;
}

input:focus {
	box-shadow: 0px 0px 0px 2px var(--highlight);
}

.results {
	text-align: left;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	flex-grow: 0;
	overflow-y: auto;
  margin-top: 10px;
}

.results a:any-link {
	display: flex;
	align-items: center;
	width: 100%;
	box-sizing: border-box;
	padding: 5px;
	transition: background 0.3s ease, color 0.3s ease;
  border-radius: 100px;
  margin: 5px 0px;
  padding: 10px;
}

.results a:hover {
  background: rgba(255, 255, 255, 0.05);
}

.results a span {
	margin-left: 10px;
}

.resultImg {
	width: 50px;
}
</style>
