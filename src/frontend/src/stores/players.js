import Vue from "vue";
import axios from "axios";
import { getPlayerId, getPlayerById } from "@nhl-api/players"

export default Vue.observable({
  async getPlayerInfo(id) {
    let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}`)
    return data
  },
  async getPlayerStats(id) {
    let data = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=yearByYear`)
    return data.data.stats[0].splits.reverse()
  },
  searchPlayers(term) {
    try {
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
    } catch (error) {
      return []
    }
  }
})