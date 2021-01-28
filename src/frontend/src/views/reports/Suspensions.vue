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
				From 2016 to 2020 the NHL's Department of Player Safety has issued
			</p>
			<h1>{{ allSuspensions.length }} suspensions</h1>
		</div>

		<div class="mainBlock bright">
			<p>Of those {{ allSuspensions.length }} suspensions,</p>
			<h1>{{ offenders[0].Count }}</h1>
			<p>
				went to the
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${offenders[0].Team}.svg`
					"
					class="imgSmallInline"
					alt="Team Logo"
				/>
				{{ getTeam(offenders[0].Team).name }}
			</p>
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
	width: 100%;
	mix-blend-mode: difference;
}

.collapsedHeader .container {
	opacity: 0;
}

.collapsedHeader .title,
.collapsedHeader h1 {
	font-size: 25px;
	color: var(--highlight);
}

.collapsedHeader .title .beta-tag {
	opacity: 0;
}
</style>

<style scoped>
.mainBlock {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.mainBlock p{
	font-size: 25px;
}

.bright {
	background: var(--highlight);
	color: var(--mainBg);
}

.imgSmallInline{
	height: 25px;
	display: inline;
}
</style>
