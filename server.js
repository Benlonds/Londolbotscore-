require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("scan", (ctx) => {
  ctx.reply("🔍 Scan SRL en cours...");
});

bot.launch();
console.log("🤖 Bot SRL lancé !");
