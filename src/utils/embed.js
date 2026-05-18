const { EmbedBuilder } = require('discord.js');

const COLORS = {
  primary:  0x63b3ed,
  success:  0x10b981,
  danger:   0xef4444,
  warn:     0xf59e0b,
  purple:   0x7c3aed,
  cyan:     0x06b6d4,
};

function base(color = COLORS.primary) {
  return new EmbedBuilder()
    .setColor(color)
    .setFooter({ text: 'OrionService • Script Hub' })
    .setTimestamp();
}

function success(title, desc) {
  return base(COLORS.success).setTitle(`✅ ${title}`).setDescription(desc);
}

function error(title, desc) {
  return base(COLORS.danger).setTitle(`❌ ${title}`).setDescription(desc);
}

function warn(title, desc) {
  return base(COLORS.warn).setTitle(`⚠️ ${title}`).setDescription(desc);
}

function info(title, desc) {
  return base(COLORS.primary).setTitle(`ℹ️ ${title}`).setDescription(desc);
}

module.exports = { base, success, error, warn, info, COLORS };
