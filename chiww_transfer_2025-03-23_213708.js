const { loadUsers, saveUsers } = require("./lib/users");
const orkut = require('./lib/chiwa-orkut')
let users = loadUsers();

const chiwa = async (m, bot) => {
  const message = m.message.text.trim();
  const prefix = global.PREFIX
  const command = message.startsWith(prefix) ? message.slice(prefix.length).split(" ")[0] : null;
  const userId = m.from.id;
  const text = command ? message.slice(prefix.length + command.length).trim() : null;
  const username = m.from.username || "Tanpa Username";
  const firstName = m.from.first_name;
  if (!users.some(user => user.id === userId)) {
    users.push({ id: userId, username, firstName, balance: 0 });
    saveUsers(users);
  }

  switch (command) {
    case 'deposit': {
        if(!text) return m.reply('Silakan masukkan jumlah deposit.');
        const deposit = parseInt(text);
   let payment_data = await orkut.createPayment(userId, 1, 1, deposit, global.BATAS_WAKTU_BAYAR, 'deposit');

        await m.replyWithPhoto(payment_data.qris_url, {caption: `Silakan lakukan pembayaran sebesar Rp${deposit} ke nomor rekening berikut:\n\n${payment_data.qris_url}\n\nJika sudah melakukan pembayaran, silakan kirim bukti transfer.`});
    }
    break

    default:
      await m.reply("Perintah tidak dikenal. Gunakan /start untuk melihat daftar perintah.");
  }
};

module.exports = { chiwa };
