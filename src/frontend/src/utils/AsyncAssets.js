let fonts = [
  "https://fonts.googleapis.com/css2?family=Heebo:wght@300;900",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
]

const load = async function () {

  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 50);
  })
  let head = document.getElementsByTagName("head")[0]

  fonts.forEach(url => {
    let link = document.createElement("link")
    link.href = url;
    link.rel = "stylesheet"
    head.appendChild(link)
  });
}


export default load