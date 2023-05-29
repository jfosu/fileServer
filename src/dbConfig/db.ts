import { Pool } from 'pg';
import config from '../config/config';

// `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const environment = process.env.NODE_ENV || 'development';
const dbConfig = environment === 'test' ? config.test.db : config[environment].db;

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
});

export default pool;

