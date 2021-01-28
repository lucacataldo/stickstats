<template>
	<div class="cont">
		<h2>Suspension Stats</h2>

    <p>
      <br>
      Amount of suspensions handed out in play against each team.
    </p>

		<div class="statCont">
			<div
				class="stat float-up"
				v-for="stat in stats.sort((a, b) => {
					return parseInt(a.Count) < parseInt(b.Count);
				})"
				:key="stat.Team"
			>
				<img
					:src="
						`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${stat.AgainstTeam}.svg`
					"
					:alt="`Team logo`"
					@error="fallbackImg"
				/>
				<h1>
					<b>{{ stat.Count }}</b>
				</h1>
				<p>
					Offences Against
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	data() {
		return {
			stats: []
		};
	},
	async mounted() {
		let resp = await axios.get("https://stickstats.club/api/public/suspensions.php?CountAgainst");
		this.stats = resp.data;

		this.animate();
	}
};
</script>

<style scoped>
.cont {
	text-align: center;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.statCont {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	max-width: 100%;
	width: 1280px;
	margin-top: 50px;
}

.stat {
	border-radius: var(--mainBorderRad);
	box-sizing: border-box;
	background: var(--light);
	padding: 20px;
	margin: 15px;
	width: 200px;
	height: 250px;
	display: flex;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: box-shadow 0.3s ease;
}

.stat:hover {
	box-shadow: 0px 0px 0px 3px var(--highlight);
	position: relative;
}

.stat:hover img {
	filter: saturate(0);
}

.stat:hover::after {
	background: rgba(0, 0, 0, 0.5);
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 100px 0px;
	font-weight: 900;
	border-radius: var(--mainBorderRad);
	position: absolute;
	content: "View details";
	opacity: 0;
	animation: statHover 0.5s 0.2s ease forwards;
}

@keyframes statHover {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.stat img {
	width: 100px;
	margin-bottom: 15px;
  transition: filter 0.3s ease;
}
</style>
