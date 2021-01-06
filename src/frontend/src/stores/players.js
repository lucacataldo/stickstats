import Vue from "vue";
import FormatSeason from "../utils/FormatSeason"
import axios from "axios";
import { getPlayerId, getPlayerById } from "@nhl-api/players"

export default Vue.observable({
  async getPlayerInfo(id) {
    let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}`)
    return data
  },
  async getPlayerStats(id, season = 2019) {
    let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=yearByYear&season=${FormatSeason(season)}`)
    return data
  },
  searchPlayers(term) {
    let res = getPlayerId(term)
    if (Array.isArray(res)) {
      return res
    } else {
      try {
        let player = getPlayerById(res);
        return [player]
      } catch (error) {
        return []
      }
    }
  }
})