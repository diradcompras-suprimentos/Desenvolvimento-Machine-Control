const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'inventario.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS equipamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    marca TEXT DEFAULT '',
    modelo TEXT DEFAULT '',
    serie TEXT DEFAULT '',
    local TEXT NOT NULL,
    status TEXT DEFAULT 'Ativo',
    imagem_url TEXT,
    data_cadastro TEXT
  )
`);

module.exports = db;
