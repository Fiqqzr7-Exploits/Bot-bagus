const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/db.json');

function read() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { games: [], executors: [], updates: [], keys: [], scripts: {} };
  }
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function get(key) {
  return read()[key];
}

function set(key, value) {
  const data = read();
  data[key] = value;
  write(data);
}

module.exports = { read, write, get, set };
