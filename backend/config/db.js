import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Create a SQL connection using our DATABASE_URL
const sql = neon(process.env.DATABASE_URL);

