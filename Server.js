require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const bot = new Telegraf(process.env.BOT_TOKEN);

const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID;

async function scanSRL() {
  const urls = [
    'https://www.flashscore.com/',
    'https://www.sofascore.com/'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      if (html.includes('Simulated Reality') || html.includes('SRL')) {
        await bot.telegram.sendMessage(TELEGRAM_USER_ID, `⚠️ Match SRL détecté sur ${url}`);
      }
    } catch (error) {
      console.error(`Erreur lors du scan de ${url}`, error.message);
    }
  }
}

// Lancer le scan toutes les 30 secondes
setInterval(scanSRL, 30000);

// Commande Telegram : /scan
bot.command('scan', async (ctx) => {
  await ctx.reply('🔍 Scan SRL en cours...');
  await scanSRL();
});

bot.launch();
console.log("🤖 Bot SRL lancé !");
