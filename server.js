require("dotenv").config();
const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.TELEGRAM_USER_ID;

const URL = "https://www.flashscore.com/soccer/simulated-reality-league/";

async function scanSRL() {
  try {
    const res = await fetch(URL, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    let alerts = [];

    $(".event__match").each((i, el) => {
      const time = $(el).find(".event__time").text().trim();
      const homeTeam = $(el).find(".event__participant--home").text().trim();
      const awayTeam = $(el).find(".event__participant--away").text().trim();
      const scoreHome = $(el).find(".event__score--home").text().trim();
      const scoreAway = $(el).find(".event__score--away").text().trim();

      if (time.includes("'") === false && (scoreHome || scoreAway)) {
        alerts.push(`⚠️ Score visible avant match : ${homeTeam} ${scoreHome}-${scoreAway} ${awayTeam} (Heure: ${time})`);
      }
    });

    return alerts;
  } catch (err) {
    console.error("Erreur de scan :", err);
    return ["❌ Erreur lors du scan Flashscore."];
  }
}

// 🔁 Scan automatique toutes les 30 secondes
setInterval(async () => {
  const alerts = await scanSRL();
  if (alerts.length > 0) {
    alerts.forEach(msg => {
      bot.telegram.sendMessage(ADMIN_ID, msg);
    });
  }
}, 30 * 1000); // 30 sec

// Commande /scan manuelle
bot.command("scan", async (ctx) => {
  ctx.reply("🔍 Scan des matchs SRL en cours...");
  const results = await scanSRL();
  results.forEach(alert => {
    ctx.reply(alert);
  });
});

// Lancement
bot.launch()
  .then(() => console.log("🤖 Bot SRL lancé avec scan automatique"))
  .catch(err => {
    console.error("❌ Erreur de lancement :", err);
    process.exit(1);
  });

// Fermeture propre
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
