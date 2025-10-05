const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = isProduction ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
module.exports = { CLIENT_URL };