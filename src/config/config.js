require("dotenv").config();

const getDialect = (url) => {
  if (!url) return "sqlite";
  if (url.startsWith("sqlite:")) return "sqlite";
  if (url.startsWith("postgres:") || url.startsWith("postgresql:")) return "postgres";
  return "sqlite"; // default fallback
};

module.exports = {
  development: {
    storage: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('sqlite:', '') : './database.sqlite',
    dialect: getDialect(process.env.DATABASE_URL),
    logging: console.log,
  },
  test: {
    storage: process.env.DATABASE_URL ? (process.env.DATABASE_URL === 'sqlite::memory:' ? ':memory:' : process.env.DATABASE_URL.replace('sqlite:', '')) : ':memory:',
    dialect: getDialect(process.env.DATABASE_URL),
    logging: false,
  },
  production: {
    ...(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') 
      ? { url: process.env.DATABASE_URL }
      : { storage: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('sqlite:', '') : './database.sqlite' }
    ),
    dialect: getDialect(process.env.DATABASE_URL),
    logging: false,
    dialectOptions: {
      ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres")
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
  },
};
