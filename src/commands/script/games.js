const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const db = require('../../utils/db');

const STATUS_LABEL = {
  working: '✅ Working',
  partial:  '⚠️ Partial',
  broken:   '❌ Broken',
  soon:     '🕐 Coming Soon',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('games')
    .setDescription('Tengok semua game yang disupport 9SpeedWay'),

  async execute(interaction) {
    const games = db.get('games');

    if (!games.length) {
      return interaction.reply({ content: '❌ Belum ada game berdaftar.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('🎮 9SpeedWay Supported Games')
      .setDescription(`Total **${games.length} game** yang disupport`)
      .setImage('https://files.catbox.moe/vssmwf.gif')
      .setFooter({ text: '9SpeedWay • Guna /getscript <game> untuk ambil script' })
      .setTimestamp();

    for (const g of games) {
      embed.addFields({
        name: `${g.icon} ${g.name}`,
        value: `${STATUS_LABEL[g.status] || '❓ Unknown'}\n📌 \`${g.feat || 'Tiada info'}\``,
        inline: true,
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
