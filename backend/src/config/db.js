import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDB = async () => {
    try {
        const schemaPath = path.join(__dirname, '../../../docs/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await query(schema);
        console.log('✅ Database schema initialized');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    }
};
