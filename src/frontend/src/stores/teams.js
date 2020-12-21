import Vue from "vue";
import axios from "axios";
export default Vue.observable({
  loading: false,
  teams: [],
  copyright: "",
  season: "",
  seasonSimple: "",
  nameTranslations: {
    gamesPlayed: "Games Played",
    wins: "Wins",
    losses: "Losses",
    ot: "Overtime Wins",
    pts: "Points",
    ptPctg: "Points Percentage",
    goalsPerGame: "Goals / Game",
    goalsAgainstPerGame: "Goals Against / Game",
    evGGARatio: "Even Strength GGA Ratio",
    powerPlayPercentage: "PP Percentage",
    powerPlayGoals: "PP Goals",
    powerPlayGoalsAgainst: "PP Goals Against",
    powerPlayOpportunities: "PP Opportunities",
    penaltyKillOpportunities: "PK Opportunities",
    penaltyKillPercentage: "PK Percentage",
    shotsPerGame: "Shots / Game",
    shotsAllowed: "Shots Allowed",
    winScoreFirst: "Wins - Scores 1st",
    winOppScoreFirst: "Wins - Opp. Scores 1st",
    winLeadFirstPer: "Wins - Leads 1st",
    winLeadSecondPer: "Wins - Leads 2nd",
    winOutshootOpp: "Wins (Outshot Opp.)",
    winOutshotByOpp: "Wins (Opp. Outshot)",
    faceOffsTaken: "Faceoffs",
    faceOffsWon: "Faceoffs Won",
    faceOffsLost: "Faceoffs Lost",
    faceOffWinPercentage: "Faceoff Win Percentage",
    shootingPctg: "Shooting Percentage",
    savePctg: "Save Percentage",
    savePctRank: "Save Percentage",
    shootingPctRank: "Shooting Percentage"
  },
  formatSeason: function (season) {
    return `${season}${season + 1}`
  },
  getTeamSeason: async function (id, season) {
    let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${id}?expand=team.stats&season=${this.formatSeason(season)}`)

    return data
  },
  getHistoricalRatings: async function (id, range = 30) {

    // let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${id}`)
    // const firstYear = parseInt(data.data.teams[0].firstYearOfPlay)

    const firstYear = new Date().getFullYear() - range;

    var teamData = {}

    for (let i = firstYear; i < (new Date().getFullYear()); i++) {
      try {
        if (localStorage.getItem(`${id}-${i}`)) {
          teamData[i] = JSON.parse(localStorage.getItem(`${id}-${i}`)).overall
        } else {
          let resp = await this.getTeamSeason(id, i);
          if (resp.status === 200) {
            teamData[i] = this.rate(resp.data.teams[0])
            localStorage.setItem(`${id}-${i}`, JSON.stringify({ year: i, overall: teamData[i] }))
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
      let currentSeason = await axios.get(`https://statsapi.web.nhl.com/api/v1/seasons/current`);
      season = currentSeason.data.seasons[0].seasonId;
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
      // todo: fix
      window.location = "/stickstats/404"
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
  }
});
