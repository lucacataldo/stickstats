import Vue from "vue";
import axios from "axios";
import Papa from "papaparse";
import { getPlayerId, getPlayerById } from "@nhl-api/players";

var SkatersAdvancedData = [];
var GoaliesAdvancedData = [];

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
			`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason`
		);
		return data.data.stats[0].splits.reverse();
	},
	async getAdvancedStats(id, type = "skater") {
		id = parseInt(id);

		if (type === "skater") {
			if (!SkatersAdvancedData.length) {
				let r = await axios.get("/advanced_stats/skaters.csv");
				SkatersAdvancedData = Papa.parse(r.data, { header: true }).data;
			}

			let found = SkatersAdvancedData.find(
				p => parseInt(p.playerId) === id && p.situation === "all"
			);

			Object.keys(found).forEach(key => {
				let parsed = parseFloat(found[key]);
				found[key] = isNaN(parsed) ? found[key] : parsed;
			});

			return found;
		} else {
			if (!GoaliesAdvancedData.length) {
				let r = await axios.get("/advanced_stats/goalies.csv");
				GoaliesAdvancedData = Papa.parse(r.data, { header: true }).data;
			}

			let found = GoaliesAdvancedData.find(
				p => parseInt(p.playerId) === id && p.situation === "all"
			);

			Object.keys(found).forEach(key => {
				let parsed = parseFloat(found[key]);
				found[key] = isNaN(parsed) ? found[key] : parsed;
			});

			return found;
		}
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
