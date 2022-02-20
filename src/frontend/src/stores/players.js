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
	searchPlayers(term) {
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
});
