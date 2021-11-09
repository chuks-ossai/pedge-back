module.exports = {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 6,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
