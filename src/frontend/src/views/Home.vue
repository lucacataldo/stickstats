<template>
	<div class="teamGrid">
		<router-link
			class="team"
			v-for="team in $parent.teams"
			v-bind:key="team.id"
			@click="$parent.openTeam(team)"
			v-bind:to="`/team/${team.id}`"
		>
			<div class="teamMask">
				<div>
					<h3>{{ team.name }}</h3>
					<img
						v-bind:src="
							`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${team.id}.svg`
						"
					/>
					<span class="subtitle">HockeyMan Score</span>
					<span class="rating">
						{{ team.overall }}
					</span>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
export default {
	name: "Home"
};
</script>

<style scoped>
.teamGrid {
	margin: 0px 100px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.team {
	position: relative;
	margin: 15px;
	box-sizing: border-box;
	cursor: pointer;
	font-size: 20px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.6s ease;
	font-weight: 900;
	overflow: hidden;
	background: var(--light);
	border-radius: 15px;
}

.teamMask {
	width: 100%;
	height: 100%;
	padding: 25px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.3s ease;
	z-index: 2;
	color: var(--mainText);
}

.rating {
	line-height: 60px;
	font-size: 50px;
}

@media screen and (max-width: 1280px) {
	.teamGrid {
		grid-template-columns: 1fr 1fr 1fr 1fr;
		margin: 0px 25px;
	}
}

@media screen and (max-width: 768px) {
	.teamGrid {
		grid-template-columns: 1fr 1fr;
		margin: 0px 10px;
	}

	.rating{
		font-size: 40px;
		line-height: 50px;
	}
}
</style>
