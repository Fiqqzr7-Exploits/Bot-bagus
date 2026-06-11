require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { validateKey } = require('./utils/keys');

const app = express();
app.use(express.json());

app.get('/', (_, res) => res.send('🌟 9SpeedWay Bot — Online'));
app.get('/health', (_, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/validate', (req, res) => {
  const key = req.query.key;
  if (!key) return res.json({ valid: false, reason: 'No key provided' });
  const result = validateKey(key);
  if (!result.valid) return res.json({ valid: false, reason: result.reason });
  return res.json({ valid: true, userId: result.data.userId, expiresAt: result.data.expiresAt });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`[HTTP] Server running on port ${process.env.PORT || 3000}`)
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

client.commands = new Collection();

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
      if ('data' in cmd && 'execute' in cmd) {
        client.commands.set(cmd.data.name, cmd);
        console.log(`[CMD] Loaded: /${cmd.data.name}`);
      }
    }
  }
}

const evtPath = path.join(__dirname, 'events');
const evtFiles = fs.readdirSync(evtPath).filter(f => f.endsWith('.js'));
for (const file of evtFiles) {
  const evt = require(path.join(evtPath, file));
  if (evt.once) {
    client.once(evt.name, (...args) => evt.execute(...args, client));
  } else {
    client.on(evt.name, (...args) => evt.execute(...args, client));
  }
}

client.login(process.env.TOKEN).catch(err => {
  console.error('[ERROR] Login gagal:', err.message);
  process.exit(1);
});
