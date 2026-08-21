import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if(!process.env.DB_URL) throw new Error('DB_URL is required')

const sql = neon(process.env.DB_URL!);
export const db = drizzle(sql);