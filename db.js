// db.js
const { Database } = require('arangojs');

const db = new Database({
  url: 'http://localhost:8529',
  databaseName: 'phishingDB',
  auth: { username: 'root', password: '' }
});

module.exports = db;
