const { SECRET_SIGNING_KEY = 'U2FsdGVkX19nV2KreWqHk1BGD+ojOGgl39N93rtj1DVVSeYcdNPGnAQt4PtU2FvJrEiPtoQRACJ0B/yIORhjvQ==' } = process.env;
const { MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  SECRET_SIGNING_KEY,
  MONGODB_URL,
  URL_REGEX,
};
