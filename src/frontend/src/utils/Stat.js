
const classifiers = {
  gamesPlayed: {
    name: "Games Played",
    type: "Integer"
  },
  wins: {
    name: "Wins",
    type: "Integer"
  },
  losses: {
    name: "Losses",
    type: "Integer"
  },
  ot: {
    name: "Overtime Wins",
    type: "Integer"
  },
  pts: {
    name: "Points",
    type: "Integer"
  },
  ptPctg: {
    name: "Points Percentage",
    type: "Percentage"
  },
  goalsPerGame: {
    name: "Goals / Game",
    type: "Decimal"
  },
  goalsAgainstPerGame: {
    name: "Goals Against Average",
    type: "Decimal"
  },
  evGGARatio: {
    name: "Even Strength GAA Ratio",
    type: "Decimal"
  },
  powerPlayPercentage: {
    name: "PP Percentage",
    type: "Percentage"
  },
  powerPlayGoals: {
    name: "PP Goals",
    type: "Integer"
  },
  powerPlayGoalsAgainst: {
    name: "PP Goals Against",
    type: "Integer"
  },
  powerPlayOpportunities: {
    name: "PP Opportunities",
    type: "Integer"
  },
  penaltyKillOpportunities: {
    name: "PK Opportunities",
    type: "Integer"
  },
  penaltyKillPercentage: {
    name: "PK Percentage",
    type: "Percentage"
  },
  shotsPerGame: {
    name: "Shots / Game",
    type: "Decimal"
  },
  shotsAllowed: {
    name: "Shots Allowed / Game",
    type: "Decimal"
  },
  winScoreFirst: {
    name: "Wins - Scores 1st",
    type: "Ratio"
  },
  winOppScoreFirst: {
    name: "Wins - Opp. Scores 1st",
    type: "Ratio"
  },
  winLeadFirstPer: {
    name: "Wins - Leads 1st",
    type: "Ratio"
  },
  winLeadSecondPer: {
    name: "Wins - Leads 2nd",
    type: "Ratio"
  },
  winOutshootOpp: {
    name: "Wins (Outshot Opp.)",
    type: "Ratio"
  },
  winOutshotByOpp: {
    name: "Wins (Opp. Outshot)",
    type: "Ratio"
  },
  faceOffsTaken: {
    name: "Faceoffs",
    type: "Integer"
  },
  faceOffsWon: {
    name: "Faceoffs Won",
    type: "Integer"
  },
  faceOffsLost: {
    name: "Faceoffs Lost",
    type: "Integer"
  },
  faceOffWinPercentage: {
    name: "Faceoff Win Percentage",
    type: "Percentage"
  },
  shootingPctg: {
    name: "Shooting Percentage",
    type: "Percentage"
  },
  savePctg: {
    name: "Save Percentage",
    type: "Ratio"
  },
  savePctRank: {
    name: "Save Percentage",
    type: "Rank"
  },
  shootingPctRank: {
    name: "Shooting Percentage",
    type: "Rank"
  }
}

const formatters = {
  Integer(val) {
    return Math.round(val)
  },
  Decimal(val, places = 1) {
    val = parseFloat(val);
    return val.toFixed(places)
  },
  Percentage(val) {
    return val + "%"
  },
  Ratio(val) {
    return val * 100
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

  static formatName(lab) {
    try {
      return classifiers[lab].name
    } catch (error) {
      console.log("Error formatting name", error);
      return lab
    }
  }

  static formatStat(lab, val) {
    try {
      return formatters[classifiers[lab].type](val)
    } catch (error) {
      console.log("Error formatting stat", error);
      return val
    }
  }


}