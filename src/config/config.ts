import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface Config {
  development: {
    db: DatabaseConfig;
  };
  production: {
    db: DatabaseConfig;
  };
  [key: string]: {
    db: DatabaseConfig;
  };
}

const config: Config = {
  development: {
    db: {
      host: process.env.DB_HOST_DEV!,
      port: parseInt(process.env.DB_PORT_DEV!),
      database: process.env.DB_NAME_DEV!,
      username: process.env.DB_USER_DEV!,
      password: process.env.DB_PASS_DEV!,
    },
  },
  production: {
    db: {
      host: process.env.DB_HOST_PROD!,
      port: parseInt(process.env.DB_PORT_PROD!),
      database: process.env.DB_NAME_PROD!,
      username: process.env.DB_USER_PROD!,
      password: process.env.DB_PASS_PROD!,
    },
  },
};

export default config;
