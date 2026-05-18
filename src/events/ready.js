module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[BOT] ✅ Online sebagai ${client.user.tag}`);
    console.log(`[BOT] Serving ${client.guilds.cache.size} server(s)`);
    client.user.setPresence({
      activities: [{ name: '⭐ OrionService | /help', type: 3 }],
      status: 'online'
    });
  }
};
