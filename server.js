require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Vérifie si le bot démarre bien
bot.launch()
  .then(() => {
    console.log("🤖 Bot SRL lancé !");
  })
  .catch((err) => {
    console.error("❌ Erreur de lancement du bot :", err);
    process.exit(1); // Stoppe l'application en cas d'erreur
  });

// Commande /scan
bot.command("scan", async (ctx) => {
  try {
    await ctx.reply("🔍 Scan en cours... (exemple)");
    // Ici tu peux ajouter ton code de scan plus tard
  } catch (error) {
    console.error("❌ Erreur dans /scan :", error);
    ctx.reply("Une erreur est survenue.");
  }
});

// Arrêt propre avec Ctrl+C ou signal Render
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
