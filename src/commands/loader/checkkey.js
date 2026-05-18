const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const { getUserKey, formatExpiry } = require('../../utils/keys');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkkey')
    .setDescription('Cek status key akses lo'),

  async execute(interaction) {
    const key = getUserKey(interaction.user.id);

    if (!key) {
      const embed = new EmbedBuilder()
        .setColor(COLORS.danger)
        .setTitle('🔑 Key Tidak Ditemukan')
        .setDescription([
          'Lo belum punya key aktif.',
          '',
          '💡 **Cara dapat key:**',
          '• Hubungi admin/owner',
          '• Gunakan `/getkey` untuk request',
        ].join('\n'))
        .setFooter({ text: 'OrionService • Script Hub' })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('🔑 Key Aktif')
      .addFields(
        { name: '🗝️ Key', value: `\`${key.key}\``, inline: false },
        { name: '⏳ Sisa Waktu', value: `\`${formatExpiry(key.expiresAt)}\``, inline: true },
        { name: '📅 Dibuat', value: `\`${new Date(key.createdAt).toLocaleDateString('id-ID')}\``, inline: true },
        { name: '🕐 Durasi', value: `\`${key.duration} hari\``, inline: true },
      )
      .setFooter({ text: 'OrionService • Jangan share key ini!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
