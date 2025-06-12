const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const USER_ID = process.env.TELEGRAM_USER_ID;

async function scanScores() {
  try {
    const urls = [
      'https://www.flashscore.com/',
      'https://www.sofascore.com/'
    ];

    let foundSuspicious = false;

    for (const url of urls) {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const suspiciousMatch = $('div:contains("SRL")').filter((i, el) => {
        const text = $(el).text();
        return /\d+\s*[:-]\s*\d+/.test(text);
      });

      if (suspiciousMatch.length > 0) {
        foundSuspicious = true;
        bot.telegram.sendMessage(USER_ID, `🚨 Score SRL détecté sur : ${url}`);
      }
    }

    if (!foundSuspicious) {
      console.log('✅ Aucun score SRL suspect détecté.');
    }
  } catch (err) {
    console.error('❌ Erreur de scan :', err);
  }
}

bot.command('scan', async (ctx) => {
  ctx.reply('🔍 Scan SRL en cours...');
  await scanScores();
});

bot.launch();
console.log('🤖 Bot SRL lancé !');

setInterval(scanScores, 30 * 1000);
