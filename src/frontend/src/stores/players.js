import Vue from "vue";
import axios from "axios";
import { getPlayerId, getPlayerById } from "@nhl-api/players";

export default Vue.observable({
	async getPlayerInfo(id) {
		let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}`);
		return data;
	},
	async getCapData(player) {
		try {
			let r = await axios.get(`/capdata/${player.currentTeam.id}.json`);

			let name = `${player.lastName}, ${player.firstName}`
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");

			if (r.data[name]) {
				let data = r.data[name];
				return data;
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	async getPlayerStats(id) {
		let data = await axios.get(
			`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=yearByYear`
		);
		return data.data.stats[0].splits.reverse();
	},
	async searchPlayers(term) {
		try {
			let r = await axios.get("https://stickstats.club/api/proxy.php", {
				params: {
					csurl: "https://api.nhle.com/stats/rest/en/players",
					cayenneExp: `fullName likeIgnoreCase "%${term}%" and currentTeamId <> null`
				}
			});
      

			return r.data.data.map(p => {
				return {
					id: p.id,
					name: `${p.firstName} ${p.lastName}`
				};
			});
		} catch (error) {
			console.error("Falling back to cache search\n\n", error);
			try {
				let res = getPlayerId(term);
				if (Array.isArray(res)) {
					console.log(res);
					return res.slice(0, 15);
				} else {
					try {
						let player = getPlayerById(res);
						return [player];
					} catch (error) {
						return [];
					}
				}
			} catch (error) {
				return [];
			}
		}
	}
});
