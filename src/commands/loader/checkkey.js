const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const { getUserKey, formatExpiry } = require('../../utils/keys');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkkey')
    .setDescription('Check status key akses kau'),

  async execute(interaction) {
    const key = getUserKey(interaction.user.id);

    if (!key) {
      const embed = new EmbedBuilder()
        .setColor(COLORS.danger)
        .setTitle('🔑 Key Tak Jumpa')
        .setDescription([
          'Kau belum ada key aktif.',
          '',
          '💡 **Cara dapat key:**',
          '• Hubungi admin/owner',
          '• Guna `/getkey` untuk request',
        ].join('\n'))
        .setFooter({ text: '9SpeedWay • Script Hub' })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('🔑 Key Aktif')
      .addFields(
        { name: '🗝️ Key', value: `\`${key.key}\``, inline: false },
        { name: '⏳ Baki Masa', value: `\`${formatExpiry(key.expiresAt)}\``, inline: true },
        { name: '📅 Dicipta', value: `\`${new Date(key.createdAt).toLocaleDateString('ms-MY')}\``, inline: true },
        { name: '🕐 Durasi', value: `\`${key.duration} hari\``, inline: true },
      )
      .setFooter({ text: '9SpeedWay • Jangan share key ni!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
