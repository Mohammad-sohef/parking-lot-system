const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'parking.db'), { verbose: console.log });

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS parkings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    exit_time DATETIME,
    amount_charged REAL,
    status TEXT DEFAULT 'parked'
  );
`);

module.exports = db;
