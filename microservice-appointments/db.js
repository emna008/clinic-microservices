const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'appointments.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    doctorName TEXT NOT NULL,
    specialty TEXT,
    dateTime TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'scheduled',
    createdAt TEXT NOT NULL
  )
`);
console.log('[Appointments DB] SQLite3 initialized');
module.exports = db;
