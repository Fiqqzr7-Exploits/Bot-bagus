require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const cmdPath = path.join(__dirname, 'commands');
const cmdFolders = fs.readdirSync(cmdPath);

for (const folder of cmdFolders) {
  const folderPath = path.join(cmdPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  const cmdFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of cmdFiles) {
    const exported = require(path.join(folderPath, file));
    const cmds = Array.isArray(exported) ? exported : [exported];
    for (const cmd of cmds) {
      if ('data' in cmd) commands.push(cmd.data.toJSON());
    }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`[DEPLOY] Deploying ${commands.length} slash commands...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('[DEPLOY] ✅ Semua slash commands berhasil di-deploy!');
  } catch (err) {
    console.error('[DEPLOY] ❌ Gagal:', err);
  }
})();
