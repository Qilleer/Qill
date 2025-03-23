const { Telegraf } = require("telegraf");
require('./settings')
const moment = require("moment-timezone");
const chalk = require("chalk");
const { chiwa } = require("./chiww");

const bot = new Telegraf(global.BOT_TOKEN);
bot.launch().then(() => console.log("✅ Bot launched!")).catch(err => console.error(err));

require('./lib/handler/pool/TransactionStatusCheck')(bot)
bot.use(async (m, next) => {

  if (m.message && m.message.text) {
    const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    console.log(
      '\x1b[1;31m~\x1b[1;37m>', 
      '[\x1b[1;32m ChiwaBot >< \x1b[1;37m]', 
      chalk.yellow(time), 
      chalk.green(m.message.text.slice(0, 100)), 
      'from', chalk.cyan(m.from.username || "Tanpa Username"), 
      'id', chalk.magenta(m.from.id)
    );
  }
  await next();
});

bot.on("text", (m) => chiwa(m, bot));

