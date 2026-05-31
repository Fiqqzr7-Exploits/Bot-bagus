const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const db = require('../../utils/db');

const LEVEL_LABEL = { full: '✅ Full Support', partial: '⚠️ Partial', broken: '❌ Tidak Support' };
const PLAT_ICON   = { PC: '💻', Mobile: '📱', 'PC & Mobile': '💻📱' };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('executor')
    .setDescription('Lihat daftar executor yang disupport'),

  async execute(interaction) {
    const execs = db.get('executors');

    const embed = new EmbedBuilder()
      .setColor(COLORS.purple)
      .setTitle('⚡ FIQQZR7 SUPPORTED EXECUTOR')
      .setDescription(`Total **${execs.length} executor** terdaftar`)
      .setFooter({ text: 'OrionService • Script Hub' })
      .setTimestamp();

    for (const e of execs) {
      embed.addFields({
        name: `${PLAT_ICON[e.platform] || '💻'} ${e.name}`,
        value: `${LEVEL_LABEL[e.level] || '❓'}\n📝 \`${e.note || '-'}\``,
        inline: true,
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
