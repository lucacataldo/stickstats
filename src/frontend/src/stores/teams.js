import Vue from "vue";
import axios from "axios";
export default Vue.observable({
	loading: false,
	teams: [],
	copyright: "",
	season: "",
	seasonSimple: "",
	getData: async function(season) {
		this.loading = true;
		if (!season) {
			let currentSeason = await axios.get(`https://statsapi.web.nhl.com/api/v1/seasons/current`);
			season = currentSeason.data.seasons[0].seasonId;
		} else {
			season = `${season}${season + 1}`;
		}

		this.season = season;

		let response = await axios.get(
			`https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats&season=${season}`
		);

		this.teams = response.data.teams;
		this.copyright = response.data.copyright;

		this.teams.forEach((team, i) => {
			const stats = team.teamStats[0].splits[1].stat;
			var sum = 0;
			var num = 1;
			for (const rank in stats) {
				sum += parseInt(stats[rank].slice(0, -2));
				num++;
			}
			this.teams[i].overall = ((100 * (num - sum / num)) / num).toFixed(1);
		});

		this.teams = this.teams.sort((a, b) => {
			return b.overall - a.overall;
		});

		this.loading = false;
	}
});
