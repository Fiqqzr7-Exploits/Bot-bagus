const emb = require('../utils/embed');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // ─── AUTOCOMPLETE ──────────────────────────────────────────────────
    if (interaction.isAutocomplete()) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd && cmd.autocomplete) {
        try { await cmd.autocomplete(interaction); } catch (e) { console.error(e); }
      }
      return;
    }

    // ─── SLASH COMMANDS ────────────────────────────────────────────────
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    try {
      await cmd.execute(interaction, client);
    } catch (err) {
      console.error(`[ERROR] /${interaction.commandName}:`, err);
      const errEmbed = emb.error('Error', `Terjadi kesalahan: \`${err.message}\``);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errEmbed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(() => {});
      }
    }
  }
};
