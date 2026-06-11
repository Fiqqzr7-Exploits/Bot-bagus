const { SlashCommandBuilder } = require('discord.js');
const { base, COLORS } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check latency bot'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Ping...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const ws = interaction.client.ws.ping;

    const embed = base(latency < 100 ? COLORS.success : latency < 250 ? COLORS.warn : COLORS.danger)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 Latency', value: `\`${latency}ms\``, inline: true },
        { name: '💗 WebSocket', value: `\`${ws}ms\``, inline: true },
        { name: '🌐 Status', value: latency < 200 ? '`🟢 Baik`' : '`🟡 Ok`', inline: true }
      );

    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
