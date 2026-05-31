const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Tampilkan semua command OrionService'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('⭐ Fiqqzr7Bots — Command List')
      .setDescription('Semua command yang tersedia di OrionService Bot')
      .addFields(
        {
          name: '📜 Script & Loader',
          value: [
            '`/getscript` — Ambil script berdasarkan game',
            '`/games` — List semua game yang disupport',
            '`/executor` — List executor yang disupport',
            '`/getkey` — Dapatkan key akses',
            '`/checkkey` — Cek status Key',
          ].join('\n'),
          inline: false
        },
        {
          name: '📋 Info',
          value: [
            '`/updates` — Lihat update log terbaru',
            '`/status` — Status panel',
            '`/ping` — Cek latency bot',
          ].join('\n'),
          inline: false
        },
        {
          name: '🔐 Admin Only',
          value: [
            '`/addgame` — Tambah game baru',
            '`/removegame` — Hapus game',
            '`/setscript` — Set script untuk game',
            '`/addupdate` — Posting update log',
            '`/announce` — Kirim announcement',
            '`/addexec` — Tambah executor',
            '`/givekey` — Beri key ke user',
            '`/revokekey` — Cabut key user',
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: 'Fiqqzr7XCode • Script Hub' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
