require('dotenv').config()

const config = {
    mongodb: {
      url: process.env.MONGO_DB_STRING,
      databaseName: 'todos',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    migrationsDir: 'migrations',
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
  };
  
  module.exports = config;