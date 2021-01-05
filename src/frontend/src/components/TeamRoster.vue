<template>
	<div class="cont" :style="loadMore ? 'max-height: 10000px' : 'max-height: 600px'">
		<h1>Roster</h1>
		<div>
			<input class="searchBox" v-model="filterTerm" placeholder="search players" type="text" />
		</div>

		<h2>Forwards</h2>
		<div v-if="!forwards.length">None Found</div>
		<div class="rosterCont">
			<player-card v-for="player in forwards" :key="player.person.id" :player="player" />
		</div>

		<h2>Defense</h2>
		<div v-if="!defense.length">None Found</div>
		<div class="rosterCont">
			<player-card v-for="player in defense" :key="player.person.id" :player="player" />
		</div>

		<h2>Goalies</h2>
		<div v-if="!goalies.length">None Found</div>
		<div class="rosterCont">
			<player-card v-for="player in goalies" :key="player.person.id" :player="player" />
		</div>

		<div v-if="!loadMore" class="load-more">
			<span class="load-more-button" @click="loadMore = true">
				Show All...
			</span>
		</div>
	</div>
</template>

<script>
import PlayerCard from "../components/PlayerCard";
export default {
	data() {
		return {
			roster: [],
			filterTerm: "",
			loadMore: false
		};
	},
	components: {
		PlayerCard
	},
	props: {
		teamId: Number,
		season: String
	},
	watch: {
		filterTerm: function() {
			this.animate(".rosterCont ");
		},
		limit: function() {
			this.animate(".rosterCont ");
		},
		loadMore: function () {
			this.animate(".rosterCont ");
		}
	},
	computed: {
		forwards: function() {
			return this.roster
				.filter(p => {
					return (
						p.position.type === "Forward" &&
						p.person.fullName.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1
					);
				})
				.slice(0, this.loadMore ? 1000 : 15);
		},
		goalies: function() {
			if (this.loadMore) {
				return this.roster.filter(p => {
					return (
						p.position.type === "Goalie" &&
						p.person.fullName.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1
					);
				});
			} else {
				return [];
			}
		},
		defense: function() {
			if (this.loadMore) {
				return this.roster.filter(p => {
					return (
						p.position.type === "Defenseman" &&
						p.person.fullName.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1
					);
				});
			} else {
				return [];
			}
		}
	},
	async mounted() {
		const resp = await this.$teams.getTeamRoster(this.teamId, this.season);
		this.roster = resp.data.roster;

		this.animate(".rosterCont ");
	}
};
</script>

<style scoped>
.cont {
	position: relative;
	text-align: center;
	margin-top: 50px;
	max-height: 600px;
	overflow-y: hidden;
	margin-bottom: 50px;
}

.load-more {
	position: absolute;
	width: 100%;
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	bottom: 0px;
	background: var(--mainBg);
	background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
	font-weight: bold;
}

.load-more-button {
	background: var(--highlight);
	color: var(--mainBg);
	padding: 10px 20px;
	border-radius: 50px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.load-more-button:hover {
	background: var(--light);
	color: var(--mainText);
	box-shadow: 0px 0px 0px 3px var(--highlight);
}

h1{
	font-size: 40px;
	margin-bottom: 20px;
}

h2 {
	font-size: 30px;
	margin-bottom: 20px;
}

.rosterCont {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 50px;
	align-items: stretch;
}

.searchBox {
	margin-left: 0;
}
</style>
