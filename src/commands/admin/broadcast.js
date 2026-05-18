const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const { sendWebhook } = require('../../utils/webhook');
const db = require('../../utils/db');

function isAdmin(interaction) {
  return interaction.user.id === process.env.OWNER_ID ||
    interaction.member.permissions.has(PermissionFlagsBits.Administrator);
}

const TYPE_ICON = { patch:'🔧', feature:'✨', hotfix:'🚨', major:'🚀', maintenance:'🛠️' };

// ─── /addupdate ────────────────────────────────────────────────────────────
const addupdate = {
  data: new SlashCommandBuilder()
    .setName('addupdate')
    .setDescription('[ADMIN] Posting update log ke Discord')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('versi').setDescription('Versi update (ex: v2.1.0)').setRequired(true))
    .addStringOption(o => o.setName('judul').setDescription('Judul update').setRequired(true))
    .addStringOption(o => o.setName('tipe').setDescription('Tipe update').setRequired(true)
      .addChoices(
        { name: '🔧 Patch', value: 'patch' },
        { name: '✨ Feature', value: 'feature' },
        { name: '🚨 Hotfix', value: 'hotfix' },
        { name: '🚀 Major', value: 'major' },
        { name: '🛠️ Maintenance', value: 'maintenance' },
      ))
    .addStringOption(o => o.setName('deskripsi').setDescription('Deskripsi update').setRequired(false)),

  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '❌ No access.', ephemeral: true });

    await interaction.deferReply();

    const ver   = interaction.options.getString('versi');
    const title = interaction.options.getString('judul');
    const type  = interaction.options.getString('tipe');
    const desc  = interaction.options.getString('deskripsi') || 'Tidak ada deskripsi.';
    const date  = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
    const icon  = TYPE_ICON[type] || '📌';

    // Save to DB
    const data = db.read();
    data.updates.unshift({ id: Date.now(), ver, title, type, desc, date });
    db.write(data);

    // Bot embed reply
    const embed = new EmbedBuilder()
      .setColor(COLORS.cyan)
      .setTitle(`${icon} ${ver} — ${title}`)
      .setDescription(desc)
      .addFields(
        { name: 'Tipe', value: type.toUpperCase(), inline: true },
        { name: 'Versi', value: ver, inline: true },
        { name: 'Tanggal', value: date, inline: true },
      )
      .setImage('https://files.catbox.moe/v13x25.jpg')
      .setFooter({ text: `Dipost oleh ${interaction.user.tag} • OrionService` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Send to webhook
    if (process.env.WEBHOOK_UPDATE) {
      await sendWebhook(process.env.WEBHOOK_UPDATE, {
        username: 'ORION UPDATE',
        embeds: [{
          title: `${icon} ${ver} — ${title}`,
          description: desc,
          color: 0x06b6d4,
          fields: [
            { name: 'Tipe', value: type.toUpperCase(), inline: true },
            { name: 'Versi', value: ver, inline: true },
            { name: 'Tanggal', value: date, inline: true },
          ],
          image: { url: 'https://files.catbox.moe/v13x25.jpg' },
          footer: { text: 'OrionService • Script Hub' },
          timestamp: new Date().toISOString(),
        }]
      });
    }
  }
};

// ─── /announce ─────────────────────────────────────────────────────────────
const ANN_TYPE = {
  info:        { e: 'ℹ️', c: 0x63b3ed, l: 'INFO' },
  maintenance: { e: '🛠️', c: 0xf59e0b, l: 'MAINTENANCE' },
  update:      { e: '🚀', c: 0x10b981, l: 'UPDATE' },
  warning:     { e: '⚠️', c: 0xef4444, l: 'WARNING' },
  event:       { e: '🎉', c: 0xa78bfa, l: 'EVENT' },
};

const announce = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('[ADMIN] Kirim announcement ke Discord')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('judul').setDescription('Judul announcement').setRequired(true))
    .addStringOption(o => o.setName('pesan').setDescription('Isi pesan').setRequired(true))
    .addStringOption(o => o.setName('tipe').setDescription('Tipe announcement').setRequired(false)
      .addChoices(
        { name: 'ℹ️ Info', value: 'info' },
        { name: '🛠️ Maintenance', value: 'maintenance' },
        { name: '🚀 Update', value: 'update' },
        { name: '⚠️ Warning', value: 'warning' },
        { name: '🎉 Event', value: 'event' },
      ))
    .addStringOption(o => o.setName('ping').setDescription('Ping siapa?').setRequired(false)
      .addChoices(
        { name: 'Tidak ada', value: 'none' },
        { name: '@everyone', value: 'everyone' },
        { name: '@here', value: 'here' },
      )),

  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '❌ No access.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    const judul = interaction.options.getString('judul');
    const pesan = interaction.options.getString('pesan');
    const tipe  = interaction.options.getString('tipe') || 'info';
    const ping  = interaction.options.getString('ping') || 'none';
    const st    = ANN_TYPE[tipe] || ANN_TYPE.info;
    const pingTxt = ping === 'everyone' ? '@everyone\n' : ping === 'here' ? '@here\n' : '';

    // Send to webhook
    if (process.env.WEBHOOK_ANN) {
      await sendWebhook(process.env.WEBHOOK_ANN, {
        username: 'OrionService',
        content: pingTxt || undefined,
        embeds: [{
          title: `${st.e} ${judul}`,
          description: pesan,
          color: st.c,
          fields: [{ name: 'Tipe', value: st.l, inline: true }],
          image: { url: 'https://files.catbox.moe/bcv6bb.gif' },
          footer: { text: 'OrionService • Script Hub' },
          timestamp: new Date().toISOString(),
        }]
      });
    }

    await interaction.editReply({ content: `✅ Announcement **${judul}** berhasil dikirim!` });
  }
};

module.exports = [addupdate, announce];
