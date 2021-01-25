import RoundNum from "./RoundNum"
const classifiers = {
  gamesPlayed: {
    name: "Games Played",
    type: "Integer",
    category: "games"
  },
  wins: {
    name: "Wins",
    type: "Integer",
    category: "games"
  },
  losses: {
    name: "Losses",
    type: "Integer",
    category: "games"
  },
  ot: {
    name: "Overtime Wins",
    type: "Integer",
    category: "games"
  },
  pts: {
    name: "Points",
    type: "Integer",
    category: "points"
  },
  ptPctg: {
    name: "Points Percentage",
    type: "Percentage",
    category: "points"
  },
  goalsPerGame: {
    name: "Goals For (Average)",
    type: "Decimal",
    category: "goals"
  },
  goalsAgainstPerGame: {
    name: "Goals Against (Average)",
    type: "Decimal",
    category: "goals"
  },
  evGGARatio: {
    name: "Even Strength GAA Ratio",
    type: "Decimal",
    category: "goals"
  },
  powerPlayPercentage: {
    name: "PP Percentage",
    type: "Percentage",
    category: "powerPlay"
  },
  powerPlayGoals: {
    name: "PP Goals",
    type: "Integer",
    category: "powerPlay"
  },
  powerPlayGoalsAgainst: {
    name: "PP Goals Against",
    type: "Integer",
    category: "powerPlay"
  },
  powerPlayOpportunities: {
    name: "PP Opportunities",
    type: "Integer",
    category: "powerPlay"
  },
  penaltyKillOpportunities: {
    name: "PK Opportunities",
    type: "Integer",
    category: "penaltyKill"
  },
  penaltyKillPercentage: {
    name: "PK Percentage",
    type: "Percentage",
    category: "penaltyKill"
  },
  shotsPerGame: {
    name: "Shots / Game",
    type: "Decimal",
    category: "shots"
  },
  shotsAllowed: {
    name: "Shots Allowed / Game",
    type: "Decimal",
    category: "shots"
  },
  winScoreFirst: {
    name: "Wins - Scores 1st",
    type: "Ratio",
    category: "situational"
  },
  winOppScoreFirst: {
    name: "Wins - Opp. Scores 1st",
    type: "Ratio",
    category: "situational"
  },
  winLeadFirstPer: {
    name: "Wins - Leads 1st",
    type: "Ratio",
    category: "situational"
  },
  winLeadSecondPer: {
    name: "Wins - Leads 2nd",
    type: "Ratio",
    category: "situational"
  },
  winOutshootOpp: {
    name: "Wins (Outshot Opp.)",
    type: "Ratio",
    category: "situational"
  },
  winOutshotByOpp: {
    name: "Wins (Opp. Outshot)",
    type: "Ratio",
    category: "situational"
  },
  faceOffsTaken: {
    name: "Faceoffs",
    type: "Integer",
    category: "faceoffs"
  },
  faceOffsWon: {
    name: "Faceoffs Won",
    type: "Integer",
    category: "faceoffs"
  },
  faceOffsLost: {
    name: "Faceoffs Lost",
    type: "Integer",
    category: "faceoffs"
  },
  faceOffWinPercentage: {
    name: "Faceoff Win Percentage",
    type: "Percentage",
    category: "faceoffs"
  },
  shootingPctg: {
    name: "Shooting Percentage",
    type: "Percentage",
    category: "shots"
  },
  savePctg: {
    name: "Save Percentage",
    type: "Ratio",
    category: "saves"
  },
  savePctRank: {
    name: "Save Percentage",
    type: "Rank",
    category: "saves"
  },
  shootingPctRank: {
    name: "Shooting Percentage",
    type: "Rank",
    category: "shots"
  }
}

const formatters = {
  Integer(val) {
    return RoundNum(val, 0)
  },
  Decimal(val, places = 1) {
    val = parseFloat(val);
    return RoundNum(val, places)
  },
  Percentage(val) {
    return RoundNum(val, 1) + "%"
  },
  Ratio(val) {
    return RoundNum(val * 100, 1) + "%"
  },
  Rank(val) {
    return val
  }
}

export default class Stat {
  constructor(lab, val) {
    this.val = val
    this.lab = lab
  }

  name() {
    try {
      return classifiers[this.lab].name
    } catch (error) {
      return this.lab
    }
  }


  // Static Methods

  static checkFilter(lab, cat) {
    try {
      return classifiers[lab].category == cat
    } catch (error) {
      console.log("Error checking filter", error);
      return true
    }
  }

  static formatName(lab) {
    try {
      return classifiers[lab].name
    } catch (error) {
      console.log("Error formatting name", error);
      return lab
    }
  }

  static formatStat(val, lab) {
    try {
      return formatters[classifiers[lab].type](val)
    } catch (error) {
      console.log("Error formatting stat", error);
      return val
    }
  }

  static categories = [
    {
      name: "games",
      displayName: "Games"
    },
    {
      name: "points",
      displayName: "Points"
    },
    {
      name: "goals",
      displayName: "Goals"
    },
    {
      name: "powerPlay",
      displayName: "Power Play"
    },
    {
      name: "penaltyKill",
      displayName: "Penalty Kill"
    },
    {
      name: "shots",
      displayName: "Shots"
    },
    {
      name: "situational",
      displayName: "Situational"
    },
    {
      name: "faceoffs",
      displayName: "Faceoffs"
    },
    {
      name: "saves",
      displayName: "Saves"
    },
  ]


}