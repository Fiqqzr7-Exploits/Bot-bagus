const crypto = require('crypto');
const db = require('./db');

function generateKey(prefix = 'FIQQ-VIP') {
  const rand = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `${prefix}-${rand.slice(0,4)}-${rand.slice(4,8)}-${rand.slice(8,12)}`;
}

function createKey(userId, duration = 30) {
  const data = db.read();
  const key = generateKey();
  const expiresAt = Date.now() + duration * 24 * 60 * 60 * 1000;

  // Remove old key if exists
  data.keys = data.keys.filter(k => k.userId !== userId);
  data.keys.push({ key, userId, expiresAt, createdAt: Date.now(), duration });
  db.write(data);
  return key;
}

function validateKey(key) {
  const keys = db.get('keys');
  const found = keys.find(k => k.key === key);
  if (!found) return { valid: false, reason: 'Key tidak ditemukan' };
  if (Date.now() > found.expiresAt) return { valid: false, reason: 'Key sudah expired' };
  return { valid: true, data: found };
}

function getUserKey(userId) {
  const keys = db.get('keys');
  return keys.find(k => k.userId === userId && Date.now() < k.expiresAt) || null;
}

function revokeKey(userId) {
  const data = db.read();
  const before = data.keys.length;
  data.keys = data.keys.filter(k => k.userId !== userId);
  db.write(data);
  return data.keys.length < before;
}

function formatExpiry(expiresAt) {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days} hari ${hours} jam`;
  return `${hours} jam`;
}

module.exports = { generateKey, createKey, validateKey, getUserKey, revokeKey, formatExpiry };
