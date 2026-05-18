const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const { getUserKey, formatExpiry } = require('../../utils/keys');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getkey')
    .setDescription('Dapatkan key akses OrionService lo'),

  async execute(interaction) {
    const key = getUserKey(interaction.user.id);

    if (!key) {
      const embed = new EmbedBuilder()
        .setColor(COLORS.danger)
        .setTitle('❌ Key Tidak Ditemukan')
        .setDescription('Lo belum punya key aktif!\n\nHubungi owner/admin untuk dapat key.')
        .setFooter({ text: '.gg/orionservice' })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('🔑 Key OrionService Lo!')
      .setDescription('Gunakan key ini di script Lua OrionService.')
      .addFields(
        { name: '🗝️ Key', value: '```\n' + key.key + '\n```', inline: false },
        { name: '⏳ Sisa Waktu', value: '`' + formatExpiry(key.expiresAt) + '`', inline: true },
        { name: '📅 Expired', value: '`' + new Date(key.expiresAt).toLocaleDateString('id-ID') + '`', inline: true },
      )
      .setFooter({ text: '.gg/orionservice • Jangan share key ini!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
