import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'journal.db');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

export default db;