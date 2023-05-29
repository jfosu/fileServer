"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config/config"));
const environment = process.env.NODE_ENV || 'development';
const dbConfig = environment === 'test' ? config_1.default.test.db : config_1.default[environment].db;
const pool = new pg_1.Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.username,
    password: dbConfig.password,
});
exports.default = pool;
