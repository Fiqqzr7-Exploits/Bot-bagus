const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Cek status OrionService panel'),

  async execute(interaction) {
    const data = db.read();
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    const working = data.games.filter(g => g.status === 'working').length;
    const partial = data.games.filter(g => g.status === 'partial').length;
    const broken  = data.games.filter(g => g.status === 'broken').length;

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('⭐ Fiqqzr7XCode — Status Panel')
      .addFields(
        { name: '🤖 Bot', value: '`🟢 Online`', inline: true },
        { name: '⏱️ Uptime', value: `\`${h}j ${m}m ${s}s\``, inline: true },
        { name: '📡 Ping', value: `\`${interaction.client.ws.ping}ms\``, inline: true },
        { name: '🎮 Game Support', value: `✅ Working: \`${working}\`\n⚠️ Partial: \`${partial}\`\n❌ Broken: \`${broken}\``, inline: true },
        { name: '⚡ Executor', value: `\`${data.executors.length}\` executor terdaftar`, inline: true },
        { name: '📋 Update Log', value: `\`${data.updates.length}\` update tercatat`, inline: true },
      )
      .setFooter({ text: 'OrionService • Script Hub' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
