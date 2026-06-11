const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const { getUserKey, formatExpiry } = require('../../utils/keys');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getkey')
    .setDescription('Dapatkan key akses 9SpeedWay kau'),

  async execute(interaction) {
    const key = getUserKey(interaction.user.id);

    if (!key) {
      const embed = new EmbedBuilder()
        .setColor(COLORS.danger)
        .setTitle('❌ Key Tak Jumpa')
        .setDescription('Kau belum ada key aktif!\n\nHubungi owner/admin untuk dapat key.')
        .setFooter({ text: '.gg/9speedway' })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('🔑 Key Kau!')
      .setDescription('Guna key ni di script Lua 9SpeedWay.')
      .addFields(
        { name: '🗝️ Key', value: '```\n' + key.key + '\n```', inline: false },
        { name: '⏳ Baki Masa', value: '`' + formatExpiry(key.expiresAt) + '`', inline: true },
        { name: '📅 Luput', value: '`' + new Date(key.expiresAt).toLocaleDateString('ms-MY') + '`', inline: true },
      )
      .setFooter({ text: '.gg/9speedway • Jangan share key ni!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
