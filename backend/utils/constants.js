const { NODE_ENV } = process.env;
const { SECRET_SIGNING_KEY } = process.env;

const { MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  NODE_ENV,
  SECRET_SIGNING_KEY,
  MONGODB_URL,
  URL_REGEX,
};
