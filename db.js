import { config } from 'dotenv';
import { Database } from 'arangojs';

config();

const db = new Database({
  url: process.env.ARANGO_URL,
  databaseName: process.env.ARANGO_DB,
  auth: { 
    username: process.env.ARANGO_USER, 
    password: process.env.ARANGO_PASSWORD 
  }
});

export default db;
