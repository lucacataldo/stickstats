import Vue from "vue";
import axios from "axios";
import FormatSeason from "../utils/FormatSeason"
export default Vue.observable({
  loading: false,
  teams: [],
  copyright: "",
  season: "",
  formatSeason: FormatSeason,
  init: async function () {
    this.season = await this.getCurrentSeason()
  },
  getTeamSeason: async function (id, season) {
    if (!season) {
      season = await this.getCurrentSeason()
    }
    let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${id}?expand=team.stats&season=${this.formatSeason(season)}`)

    return data
  },
  getTeamRoster: async function (id, season) {
    let data = await axios.get(` https://statsapi.web.nhl.com/api/v1/teams/${id}/roster?season=${this.formatSeason(season)}`)

    return data
  },
  getHistoricalRatings: async function (id, range = 30) {
    let thisYear = (await axios.get(`https://statsapi.web.nhl.com/api/v1/seasons/current`)).data.seasons[0].seasonId;
    thisYear = parseInt(thisYear.slice(0,4))

    const firstYear = thisYear - range;

    var teamData = {}

    for (let i = firstYear; i <= thisYear; i++) {
      try {
        if (localStorage.getItem(`${id}-${i}`) && (i !== thisYear)) {
          teamData[i] = JSON.parse(localStorage.getItem(`${id}-${i}`)).overall
        } else {
          let resp = await this.getTeamSeason(id, i);
          if (resp.status === 200) {
            teamData[i] = this.rate(resp.data.teams[0])
            if (i !== thisYear) {
              localStorage.setItem(`${id}-${i}`, JSON.stringify({ year: i, overall: teamData[i] }))
            }
          } else {
            teamData[i] = null;
            localStorage.setItem(`${id}-${i}`, JSON.stringify({ year: i, overall: null }))
          }
        }
      } catch (error) {
        teamData[i] = null
        localStorage.setItem(`${id}-${i}`, JSON.stringify({ year: i, overall: null }))
        console.log(error);
      }

      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 25);
      })
    }

    return teamData
  },
  rate: function (team) {
    if (!team.teamStats[0].splits[0].stat.gamesPlayed) {
      return 0
    }

    const stats = team.teamStats[0].splits[1].stat;
    var sum = 0;
    var num = 1;
    for (const rank in stats) {
      sum += parseInt(stats[rank].slice(0, -2));
      num++;
    }

    return ((100 * (num - sum / num)) / num).toFixed(1)
  },
  getData: async function (season) {
    this.loading = true;
    if (!season) {
      season = await this.getCurrentSeason();
    } else {
      season = this.formatSeason(season);
    }

    this.season = season;
    let response;
    try {
      response = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats&season=${season}`
      );
    } catch (error) {
      this.loading = false
      alert("Cannot get season.")
      return
      // todo: fix
      // window.location = "/stickstats/404"
    }

    this.teams = response.data.teams;
    this.copyright = response.data.copyright;

    this.teams.forEach((team, i) => {

      this.teams[i].overall = this.rate(team);
    });

    this.teams = this.teams.sort((a, b) => {
      return b.overall - a.overall;
    });

    this.loading = false;
  },
  getCurrentSeason: async function () {
    try {
      let s = await await axios.get(`https://statsapi.web.nhl.com/api/v1/seasons/current`)
      return s.data.seasons[0].seasonId
    } catch (error) {
      console.log("Error getting current season \n\n", error);
      return ""
    }
  }
});
