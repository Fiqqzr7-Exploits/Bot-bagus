# ⭐ OrionService Bot

Discord bot untuk OrionService Script Hub — dibuat dengan discord.js v14, deploy ke Render.

---

## 📁 Struktur File

```
orionbot/
├── src/
│   ├── index.js              # Entry point
│   ├── deploy.js             # Deploy slash commands
│   ├── commands/
│   │   ├── general/          # help, ping, status
│   │   ├── script/           # games, executor, updates
│   │   ├── loader/           # getscript, checkkey
│   │   └── admin/            # game, broadcast, keys
│   ├── events/
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   └── utils/
│       ├── db.js             # Database helper (JSON)
│       ├── embed.js          # Embed builder
│       ├── webhook.js        # Webhook sender
│       └── keys.js           # Key generator & validator
├── data/
│   └── db.json               # Database utama
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Setup

### 1. Clone & Install
```bash
npm install
```

### 2. Buat file `.env`
Copy dari `.env.example` terus isi:
```env
TOKEN=bot_token_lo
CLIENT_ID=application_id_bot
GUILD_ID=id_server_discord
OWNER_ID=id_discord_lo
WEBHOOK_UPDATE=https://discord.com/api/webhooks/...
WEBHOOK_GAME=https://discord.com/api/webhooks/...
WEBHOOK_EXEC=https://discord.com/api/webhooks/...
WEBHOOK_ANN=https://discord.com/api/webhooks/...
PORT=3000
```

### 3. Deploy Slash Commands
```bash
node src/deploy.js
```

### 4. Jalankan Bot
```bash
npm start
```

---

## 🚀 Deploy ke Render

1. Push folder ini ke GitHub (repo baru)
2. Buka [render.com](https://render.com) → New → **Web Service**
3. Connect repo GitHub lo
4. Setting:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
5. Tambah semua variable dari `.env` di bagian **Environment Variables**
6. Deploy!

> ⚠️ **Render Free Tier** — service akan sleep setelah 15 menit idle.
> Bot sudah ada Express server di port 3000 untuk keepalive.
> Gunakan [UptimeRobot](https://uptimerobot.com) ping URL Render lo tiap 5 menit biar ga sleep.

---

## 📋 Command List

### 🔓 Public
| Command | Deskripsi |
|---|---|
| `/help` | List semua command |
| `/ping` | Cek latency bot |
| `/status` | Status panel OrionService |
| `/games` | Lihat game yang disupport |
| `/executor` | Lihat executor yang disupport |
| `/updates` | Lihat update log terbaru |
| `/getscript <game>` | Ambil script untuk game |
| `/checkkey` | Cek status key lo |

### 🔐 Admin Only
| Command | Deskripsi |
|---|---|
| `/addgame` | Tambah game baru |
| `/removegame` | Hapus game |
| `/setscript` | Set script Lua untuk game |
| `/addupdate` | Posting update log |
| `/announce` | Kirim announcement |
| `/addexec` | Tambah executor |
| `/givekey <user> [durasi]` | Beri key ke user |
| `/revokekey <user>` | Cabut key user |

---

## 🔑 Sistem Key

- Key format: `ORION-XXXX-XXXX-XXXX`
- Key dibuat otomatis saat `/givekey` dipanggil
- User dapat DM berisi key mereka
- Key bisa dicek dengan `/checkkey`
- Key expired otomatis sesuai durasi

---

Made with ❤️ by OrionService
