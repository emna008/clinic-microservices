const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'patients.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    dateOfBirth TEXT,
    gender TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    address TEXT,
    bloodType TEXT,
    createdAt TEXT NOT NULL
  )
`);
console.log('[Patients DB] SQLite3 initialized');
module.exports = db;
