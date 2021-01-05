<template>
	<div class="player float-up">
		<span class="name">{{ player.person.fullName }}</span>
		<img
			:src="`http://nhl.bamcontent.com/images/headshots/current/168x168/${player.person.id}.jpg`"
			:alt="player.person.fullName"
      loading="lazy"
		/>
		<span class="bottomText">
			<span>{{ player.position.abbreviation }}</span>
			<span class="number">#{{ player.jerseyNumber }}</span>
		</span>
	</div>
</template>

<script>
export default {
	props: {
		player: Object
	}
};
</script>

<style scoped>
.player {
	width: 175px;
	min-height: 200px;
	margin: 10px;
	background: var(--light);
	box-sizing: border-box;
	padding: 15px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	border-radius: 20px;
}

.name {
	font-weight: bold;
	font-size: 16px;
}

.bottomText {
	display: flex;
	justify-content: space-between;
	width: 100%;
	font-size: 30px;
	font-weight: bold;
}

.number{
  color: var(--highlight);
}

.playerImg {
	position: relative;
}

img {
	width: 90%;
	border-radius: 200px;
	margin: 15px 0px;
}


@media (max-width: 576px) {
  .player{
    width: 40%;
    margin: 5px 2px;
  }
}
</style>
