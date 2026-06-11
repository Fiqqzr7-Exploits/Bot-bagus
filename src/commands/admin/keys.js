const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const { createKey, revokeKey, formatExpiry, getUserKey } = require('../../utils/keys');
const db = require('../../utils/db');

function isAdmin(interaction) {
  return interaction.user.id === process.env.OWNER_ID ||
    interaction.member.permissions.has(PermissionFlagsBits.Administrator);
}

// ─── /givekey ──────────────────────────────────────────────────────────────
const givekey = {
  data: new SlashCommandBuilder()
    .setName('givekey')
    .setDescription('[ADMIN] Beri key akses ke user')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(o => o.setName('user').setDescription('User yang dikasi key').setRequired(true))
    .addIntegerOption(o => o.setName('durasi').setDescription('Durasi dalam hari (default: 30)').setRequired(false).setMinValue(1).setMaxValue(365)),

  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '❌ Tiada akses.', ephemeral: true });

    const target   = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('durasi') || 30;
    const key      = createKey(target.id, duration);
    const expiry   = Date.now() + duration * 86400000;

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('🔑 Key Berjaya Diberi')
      .addFields(
        { name: '👤 User', value: `<@${target.id}> \`(${target.tag})\``, inline: false },
        { name: '🗝️ Key', value: `\`${key}\``, inline: false },
        { name: '⏳ Durasi', value: `\`${duration} hari\``, inline: true },
        { name: '📅 Luput', value: `\`${new Date(expiry).toLocaleDateString('ms-MY')}\``, inline: true },
      )
      .setFooter({ text: `Diberi oleh ${interaction.user.tag} • 9SpeedWay` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // DM the user
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle('🔑 Key 9SpeedWay Kau!')
        .setDescription('Kau dapat key akses 9SpeedWay. Simpan elok-elok!')
        .addFields(
          { name: '🗝️ Key', value: `\`${key}\``, inline: false },
          { name: '⏳ Beraku', value: `\`${duration} hari\``, inline: true },
          { name: '📅 Luput', value: `\`${new Date(expiry).toLocaleDateString('ms-MY')}\``, inline: true },
        )
        .setFooter({ text: '9SpeedWay • Jangan share key ni!' })
        .setTimestamp();
      await target.send({ embeds: [dmEmbed] });
    } catch {
      // DM disabled, skip
    }
  }
};

// ─── /revokekey ────────────────────────────────────────────────────────────
const revokekey = {
  data: new SlashCommandBuilder()
    .setName('revokekey')
    .setDescription('[ADMIN] Cabut key akses user')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(o => o.setName('user').setDescription('User yang key-nya nak dicabut').setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '❌ Tiada akses.', ephemeral: true });

    const target  = interaction.options.getUser('user');
    const success = revokeKey(target.id);

    if (!success) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.warn)
          .setTitle('⚠️ Tiada Key')
          .setDescription(`<@${target.id}> tak ada key aktif.`)],
        ephemeral: true
      });
    }

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(COLORS.danger)
        .setTitle('🔑 Key Dicabut')
        .setDescription(`Key akses <@${target.id}> berjaya dicabut.`)
        .setFooter({ text: `Dicabut oleh ${interaction.user.tag} • 9SpeedWay` })
        .setTimestamp()]
    });
  }
};

// ─── /addexec ──────────────────────────────────────────────────────────────
const addexec = {
  data: new SlashCommandBuilder()
    .setName('addexec')
    .setDescription('[ADMIN] Tambah executor ke database')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('nama').setDescription('Nama executor').setRequired(true))
    .addStringOption(o => o.setName('platform').setDescription('Platform').setRequired(true)
      .addChoices(
        { name: '💻 PC', value: 'PC' },
        { name: '📱 Mobile', value: 'Mobile' },
        { name: '💻📱 PC & Mobile', value: 'PC & Mobile' },
      ))
    .addStringOption(o => o.setName('level').setDescription('Level support').setRequired(true)
      .addChoices(
        { name: '✅ Full Support', value: 'full' },
        { name: '⚠️ Partial', value: 'partial' },
        { name: '❌ Tak Support', value: 'broken' },
      ))
    .addStringOption(o => o.setName('catatan').setDescription('Catatan tambahan').setRequired(false)),

  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '❌ Tiada akses.', ephemeral: true });

    const nama     = interaction.options.getString('nama');
    const platform = interaction.options.getString('platform');
    const level    = interaction.options.getString('level');
    const note     = interaction.options.getString('catatan') || '';
    const data     = db.read();

    if (data.executors.find(e => e.name.toLowerCase() === nama.toLowerCase())) {
      return interaction.reply({ content: `❌ Executor **${nama}** dah ada!`, ephemeral: true });
    }

    data.executors.push({ id: Date.now(), name: nama, platform, level, note });
    db.write(data);

    const PLAT = { PC:'💻', Mobile:'📱', 'PC & Mobile':'💻📱' };
    const LVLABEL = { full:'✅ Full Support', partial:'⚠️ Partial', broken:'❌ Tak Support' };

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle('✅ Executor Ditambah')
        .addFields(
          { name: 'Nama', value: `${PLAT[platform]||'💻'} ${nama}`, inline: true },
          { name: 'Platform', value: platform, inline: true },
          { name: 'Level', value: LVLABEL[level], inline: true },
          { name: 'Catatan', value: note || '-', inline: false },
        )
        .setFooter({ text: `Ditambah oleh ${interaction.user.tag} • 9SpeedWay` })
        .setTimestamp()]
    });
  }
};

module.exports = [givekey, revokekey, addexec];
