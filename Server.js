require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Commande /scan
bot.command("scan", (ctx) => {
  ctx.reply("🔍 Scan SRL en cours...");
  // Ajoute ici ta logique plus tard
});

// Lancement du bot
bot.launch();
console.log("🤖 Bot SRL lancé !");
