const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { COLORS } = require('../../utils/embed');
const db = require('../../utils/db');

function isOwner(userId) {
  return userId === process.env.OWNER_ID;
}

// ─── /addgame ──────────────────────────────────────────────────────────────
const addgame = {
  data: new SlashCommandBuilder()
    .setName('addgame')
    .setDescription('[ADMIN] Tambah game baru ke database')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('nama').setDescription('Nama game').setRequired(true))
    .addStringOption(o => o.setName('icon').setDescription('Emoji icon').setRequired(true))
    .addStringOption(o => o.setName('status').setDescription('Status game').setRequired(true)
      .addChoices(
        { name: '✅ Working', value: 'working' },
        { name: '⚠️ Partial', value: 'partial' },
        { name: '❌ Broken', value: 'broken' },
        { name: '🕐 Coming Soon', value: 'soon' },
      ))
    .addStringOption(o => o.setName('fitur').setDescription('Fitur yang ada, pisah koma').setRequired(false)),

  async execute(interaction) {
    if (!isOwner(interaction.user.id) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Lo tidak punya akses command ini.', ephemeral: true });
    }

    const data = db.read();
    const nama   = interaction.options.getString('nama');
    const icon   = interaction.options.getString('icon');
    const status = interaction.options.getString('status');
    const fitur  = interaction.options.getString('fitur') || '';

    const exists = data.games.find(g => g.name.toLowerCase() === nama.toLowerCase());
    if (exists) return interaction.reply({ content: `❌ Game **${nama}** sudah ada!`, ephemeral: true });

    const newGame = { id: Date.now(), name: nama, icon, status, feat: fitur, script: '' };
    data.games.push(newGame);
    db.write(data);

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('✅ Game Ditambahkan')
      .addFields(
        { name: 'Nama', value: `${icon} ${nama}`, inline: true },
        { name: 'Status', value: status, inline: true },
        { name: 'Fitur', value: fitur || '-', inline: true },
      )
      .setFooter({ text: `Ditambahkan oleh ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

// ─── /removegame ───────────────────────────────────────────────────────────
const removegame = {
  data: new SlashCommandBuilder()
    .setName('removegame')
    .setDescription('[ADMIN] Hapus game dari database')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('nama').setDescription('Nama game yang mau dihapus').setRequired(true).setAutocomplete(true)),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused().toLowerCase();
    const games = db.get('games');
    await interaction.respond(
      games.filter(g => g.name.toLowerCase().includes(focused)).slice(0, 25)
        .map(g => ({ name: `${g.icon} ${g.name}`, value: g.name }))
    );
  },

  async execute(interaction) {
    if (!isOwner(interaction.user.id) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Lo tidak punya akses command ini.', ephemeral: true });
    }

    const nama = interaction.options.getString('nama');
    const data = db.read();
    const idx  = data.games.findIndex(g => g.name.toLowerCase() === nama.toLowerCase());
    if (idx === -1) return interaction.reply({ content: `❌ Game **${nama}** tidak ditemukan.`, ephemeral: true });

    const removed = data.games.splice(idx, 1)[0];
    db.write(data);

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(COLORS.danger)
        .setTitle('🗑️ Game Dihapus')
        .setDescription(`**${removed.icon} ${removed.name}** berhasil dihapus dari database.`)
        .setFooter({ text: `Dihapus oleh ${interaction.user.tag}` })
        .setTimestamp()]
    });
  }
};

// ─── /setscript ────────────────────────────────────────────────────────────
const setscript = {
  data: new SlashCommandBuilder()
    .setName('setscript')
    .setDescription('[ADMIN] Set script Lua untuk game')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('game').setDescription('Nama game').setRequired(true).setAutocomplete(true))
    .addStringOption(o => o.setName('script').setDescription('Isi script Lua').setRequired(true)),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused().toLowerCase();
    const games = db.get('games');
    await interaction.respond(
      games.filter(g => g.name.toLowerCase().includes(focused)).slice(0, 25)
        .map(g => ({ name: `${g.icon} ${g.name}`, value: g.name }))
    );
  },

  async execute(interaction) {
    if (!isOwner(interaction.user.id) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Lo tidak punya akses command ini.', ephemeral: true });
    }

    const gameName = interaction.options.getString('game');
    const script   = interaction.options.getString('script');
    const data     = db.read();
    const game     = data.games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

    if (!game) return interaction.reply({ content: `❌ Game **${gameName}** tidak ditemukan.`, ephemeral: true });

    game.script = script;
    db.write(data);

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle('✅ Script Diupdate')
        .setDescription(`Script untuk **${game.icon} ${game.name}** berhasil diset.`)
        .addFields({ name: '📋 Preview', value: `\`\`\`lua\n${script.slice(0, 200)}${script.length > 200 ? '...' : ''}\n\`\`\`` })
        .setFooter({ text: `Diset oleh ${interaction.user.tag}` })
        .setTimestamp()],
      ephemeral: true
    });
  }
};

module.exports = [addgame, removegame, setscript];
