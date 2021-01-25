export default function (season) {
  if (parseInt(season) > 9999) {
    return season
  }
  season = parseInt(season);

  return `${season}${season + 1}`
}