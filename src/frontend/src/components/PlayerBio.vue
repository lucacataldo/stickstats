<template>
	<div class="top">
		<img
			class="playerPhoto"
			:src="`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`"
			:alt="player.fullName"
		/>
		<div class="info">
			<h1>
				<span class="position">{{ player.primaryPosition.abbreviation }}</span>
				{{ player.fullName }} #{{ player.primaryNumber }}
			</h1>
			<div class="attributes">
				<div>
					<h2>
						<i :class="{ leftHanded: player.shootsCatches == 'L' }" class="far fa-hand-paper"></i>
						{{ player.shootsCatches }}
					</h2>
				</div>

				<div>
					<h2>
						<i class="fa fa-arrows-alt-v"></i>
						{{ player.height }}
					</h2>
				</div>

				<div>
					<h2>
						<img
							height="20px"
							:src="findFlagUrlByIso3Code(player.birthCountry.toLowerCase())"
							alt=""
						/>
						{{ player.birthCity }}, {{ player.birthStateProvince }} {{ player.birthCountry }}
					</h2>
				</div>

				<div>
					<h2>
						<i class="fa fa-birthday-cake"></i>
						{{ new Date(player.birthDate).toDateString().slice(4) }}
						({{ player.currentAge }}yrs old)
					</h2>
				</div>

				<div>
					<h2>
						<i class="fa fa-weight"></i>
						{{ player.weight }}lbs
					</h2>
				</div>

				<div v-if="capData && capData.capHit">
					<h2>
						<i class="fas fa-coins"></i>
						{{ capData.capHit }} (AAV)
					</h2>
				</div>

				<div v-if="capData && contractExpires">
					<h2>
						<i class="fas fa-file-signature"></i>
						{{ contractExpires }}
					</h2>
				</div>
			</div>
		</div>
		<router-link
			style="text-align: center"
			v-if="player.currentTeam"
			:to="`/team/${player.currentTeam.id}/season/${$teams.season.slice(0, 4)}`"
		>
			<img
				v-bind:src="
					`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${player.currentTeam.id}.svg`
				"
				@error="fallbackImg"
				width="200px"
			/>
			<h4>Current Team</h4>
		</router-link>
	</div>
</template>

<script>
import { findFlagUrlByIso3Code } from "country-flags-svg";
export default {
	props: ["player", "capData"],
	methods: {
		findFlagUrlByIso3Code
	},
	computed: {
		contractExpires: function() {
			if (this.capData.yearsLeft) {
				let expiryStatus = this.capData.expiryStatus || "FA";
				switch (parseInt(this.capData.yearsLeft)) {
					case 1:
						return `${expiryStatus} after this year`;

					case 2:
						return `${expiryStatus} after next year`;

					case 3:
						return `${expiryStatus} after 2 years`;

					case 4:
						return `${expiryStatus} after 3 years`;

					case 5:
						return `${expiryStatus} after 4 years`;

					case 6:
						return `${expiryStatus} after 5+ years`;

					default:
						return null;
				}
			} else {
				return null;
			}
		}
	}
};
</script>

<style scoped>
.top {
	align-items: center;
	display: flex;
}

.info {
	flex-grow: 1;
}

.playerPhoto {
	margin: 0px 50px;
	border-radius: 200px;
}

i.leftHanded {
	transform: scaleX(-1);
}

.attributes {
	padding-top: 10px;
	display: flex;
	flex-wrap: wrap;
}

.attributes > div {
	margin-right: 30px;
}

.position {
	padding: 0px 10px;
	border-radius: var(--mainBorderRad);
	background: var(--highlight);
	color: var(--mainBg);
}
</style>
