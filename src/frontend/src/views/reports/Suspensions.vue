<template>
	<div class="mainCont">
		<div class="mainBlock bright">
			<loader message="Loading historical ratings..." v-if="!loaded" />
			<div v-else>
				<h2>By the numbers:</h2>
				<h1>Player Suspensions by the DOPS</h1>
			</div>
		</div>

		<div class="mainBlock">
			<p>
				From 2016 to 2020 the NHL's Department of Player Safety issued
			</p>
			<h1>{{ allSuspensions.length }} suspensions</h1>
		</div>

		<div class="mainBlock bright row bumpZ">
			<div class="flex column half">
				<h1>{{ offenders[0].Count }}</h1>
				<p>
					of those {{ allSuspensions.length }} suspensions went to the
					{{ getTeam(offenders[0].Team).name }}
				</p>
			</div>

			<div class="flex half dark column bold">
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${offenders[0].Team}.svg`
					"
					width="250px"
					alt="Team Logo"
				/>
				{{ getTeam(offenders[0].Team).name }}
			</div>
			<div class="bottomText">
				<div>Making them the <b>most suspended</b> team</div>
			</div>
		</div>

		<div class="mainBlock dark row">
			<div class="flex column half">
				<h1>{{ offenders[0].Count }}</h1>
				<p>of those {{ allSuspensions.length }} suspensions went to the</p>
			</div>

			<div class="flex half bright column bold">
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${offenders[0].Team}.svg`
					"
					width="250px"
					alt="Team Logo"
				/>
				{{ getTeam(offenders[0].Team).name }}
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import Loader from "../../components/Loader.vue";
export default {
	components: { Loader },
	data() {
		return {
			loaded: false,
			teams: [],
			allSuspensions: [],
			offenders: []
		};
	},
	async mounted() {
		var resp = await axios.get("https://statsapi.web.nhl.com/api/v1/teams");
		this.teams = resp.data.teams;

		resp = await axios.get("https://stickstats.club/api/public/suspensions.php");
		this.allSuspensions = resp.data;

		resp = await axios.get("https://stickstats.club/api/public/suspensions.php?CountOffenders");
		this.offenders = this.teams
			.map(t => {
				let retVal = resp.data.find(o => parseInt(o.Team) === t.id);
				if (retVal) {
					return retVal;
				} else {
					return { Team: t.id.toString(), Count: 0 };
				}
			})
			.sort((a, b) => a.Count < b.Count);

		document.querySelector(".header").classList.add("headerAnimate");
    document.querySelector(".header").classList.add("collapsedHeader");
    document.querySelector(".copyright").classList.add("hide")

		setTimeout(() => {
			this.loaded = true;
		}, 500);
	},
	methods: {
		getTeam(id) {
			id = parseInt(id);
			return this.teams.find(t => t.id == id);
		}
	},
	beforeDestroy() {
    document.querySelector(".header").classList.remove("collapsedHeader");
    document.querySelector(".copyright").classList.remove("hide")
		setTimeout(() => {
			document.querySelector(".header").classList.remove("headerAnimate");
		}, 500);
	}
};
</script>

<style>
.headerAnimate {
	transition: all 0.5s ease;
}

.headerAnimate * {
	transition: all 0.5s ease;
}

.collapsedHeader {
	height: 50px;
	position: fixed;
	z-index: 10;
	width: 100%;
	background: var(--highlight);
}

.collapsedHeader .container {
	opacity: 0;
}

.collapsedHeader .title,
.collapsedHeader h1,
.collapsedHeader .highlight {
	font-size: 25px;
  color: var(--light);
}

.collapsedHeader .title .beta-tag {
	opacity: 0;
}

.hide{
  display: none;
}
</style>

<style scoped>
.mainCont {
	overflow-y: scroll;
	width: 100%;
	height: 100vh;
	scroll-snap-type: y proximity;
  background: var(--mainBg);
}

.mainCont > div {
	scroll-snap-align: center;
}

.mainBlock {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex-wrap: wrap;
	position: relative;
}

.flex {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
}

.column {
	flex-direction: column;
}

.row {
	flex-direction: row;
}

.half {
	height: 100%;
	flex-basis: 50%;
	flex-shrink: 0;
}

.bottomText {
	font-size: 20px;
	position: absolute;
	width: 100%;
	bottom: -30px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60px;
	padding: 10px 20px;
	box-sizing: border-box;
	background: var(--mainBg);
	color: var(--mainText);
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.bold {
	font-weight: bold;
}

.mainBlock p {
	font-size: 25px;
}

.bright {
	background: var(--highlight);
	color: var(--mainBg);
}

.dark {
	background: var(--mainBg);
	color: var(--mainText);
}

.bumpZ {
	z-index: 5;
}
</style>
