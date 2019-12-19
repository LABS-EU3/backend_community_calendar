let connectionUrl = "";

switch (process.env.NODE_ENV) {
  case "development":
    connectionUrl = process.env.DATABASE_URL_DEVELOPMENT;
    break;

  case "staging":
    connectionUrl = process.env.DATABASE_URL_STAGING;
    break;

  case "test":
    connectionUrl = process.env.DATABASE_URL_TEST;
    break;

  case "production":
    connectionUrl = process.env.DATABASE_URL_PRODUCTION;
    break;

  default:
    connectionUrl = process.env.DATABASE_URL_DEVELOPMENT;
}

module.exports = connectionUrl;
