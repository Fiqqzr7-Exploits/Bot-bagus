const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getscript')
    .setDescription('Ambil script untuk game tertentu')
    .addStringOption(opt =>
      opt.setName('game')
        .setDescription('Nama game yang nak diambil scriptnya')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused().toLowerCase();
    const games = db.get('games');
    const filtered = games
      .filter(g => g.name.toLowerCase().includes(focused) && g.script)
      .slice(0, 25)
      .map(g => ({ name: `${g.icon} ${g.name}`, value: g.name }));
    await interaction.respond(filtered);
  },

  async execute(interaction) {
    const gameName = interaction.options.getString('game');
    const games = db.get('games');
    const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

    if (!game) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.danger)
          .setTitle('❌ Game Tak Jumpa')
          .setDescription(`Game **${gameName}** tak ada di database.\nGuna \`/games\` untuk tengok game yang tersedia.`)
          .setFooter({ text: '9SpeedWay' })],
        ephemeral: true
      });
    }

    if (!game.script) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.warn)
          .setTitle('⚠️ Script Belum Sedia')
          .setDescription(`Script untuk **${game.icon} ${game.name}** belum diset.\nHubungi admin untuk info lanjut.`)
          .setFooter({ text: '9SpeedWay' })],
        ephemeral: true
      });
    }

    // Send script privately
    const scriptEmbed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle(`${game.icon} ${game.name} — Script`)
      .setDescription([
        `**Status:** ${game.status === 'working' ? '✅ Working' : game.status === 'partial' ? '⚠️ Partial' : '❌ Broken'}`,
        `**Fitur:** \`${game.feat || '-'}\``,
        '',
        '**📋 Script:**',
        `\`\`\`lua\n${game.script}\n\`\`\``,
      ].join('\n'))
      .setFooter({ text: '9SpeedWay • Jangan share script ni dengan orang lain!' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Salin Script')
        .setStyle(ButtonStyle.Success)
        .setEmoji('📋')
        .setCustomId('copy_script')
    );

    await interaction.reply({ embeds: [scriptEmbed], components: [row], ephemeral: true });

    // Public notice
    const publicEmbed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setDescription(`📤 <@${interaction.user.id}> mengambil script **${game.icon} ${game.name}** — dihantar ke DM/ephemeral`)
      .setFooter({ text: '9SpeedWay' });

    await interaction.followUp({ embeds: [publicEmbed] });
  }
};
