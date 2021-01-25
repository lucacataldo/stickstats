/**
 * 
 * @param {Number} num The value to round
 * @param {Number} places Max number of places to round to
 */
export default function (num, places) {
  try {
    num = parseFloat(num)
    if (num % Math.round(num) === 0) {
      return num
    } else {
      return num.toFixed(places)
    }
  } catch (error) {
    console.log("Error Rounding Number", error);
    return 0
  }


}