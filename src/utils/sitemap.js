const fs = require("fs");
const axios = require("axios");

let generate = async () => {

  const d = new Date();

  const baseUrl = "https://stickstats.club"

  let resp = await axios.get(`https://statsapi.web.nhl.com/api/v1/seasons/current`);
  const season = resp.data.seasons[0].seasonId.slice(0, 4);

  resp = await axios.get("https://statsapi.web.nhl.com/api/v1/teams")

  let teams = resp.data.teams

  fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n
    <url>
      <loc>https://stickstats.club</loc>
      <lastmod>${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>
  `)
  teams.forEach(team => {
    fs.appendFileSync('sitemap.xml', `
    <url>
        <loc>${baseUrl}/team/${team.id}/season/${season}</loc>
        <lastmod>${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}</lastmod>
        <changefreq>weekly</changefreq>
    </url>
    `);
  });

  fs.appendFileSync("sitemap.xml", `
</urlset>
  `)

  fs.renameSync("sitemap.xml", "../frontend/public/sitemap.xml")


  console.log("done!");

}


generate()