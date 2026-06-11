const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const db = require('../../utils/db');

const TYPE_ICON = { patch:'🔧', feature:'✨', hotfix:'🚨', major:'🚀', maintenance:'🛠️' };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updates')
    .setDescription('Tengok update log terbaru 9SpeedWay'),

  async execute(interaction) {
    const updates = db.get('updates');

    if (!updates.length) {
      return interaction.reply({ content: '📋 Belum ada update log.', ephemeral: true });
    }

    const latest = updates.slice(0, 5);

    const embed = new EmbedBuilder()
      .setColor(COLORS.cyan)
      .setTitle('📋 9SPEEDWAY UPDATE — Log Terbaru')
      .setImage('https://files.catbox.moe/v13x25.jpg')
      .setFooter({ text: '9SpeedWay • Script Hub' })
      .setTimestamp();

    for (const u of latest) {
      const icon = TYPE_ICON[u.type] || '📌';
      embed.addFields({
        name: `${icon} ${u.ver} — ${u.title}`,
        value: `> ${u.desc || 'Tiada deskripsi.'}\n📅 \`${u.date}\` · \`${(u.type || 'patch').toUpperCase()}\``,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
