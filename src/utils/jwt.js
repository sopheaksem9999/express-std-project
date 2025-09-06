const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const sign = (payload, secret, opts) => {
  return jwt.sign(payload, secret, opts);
};

const verify = promisify(jwt.verify);

module.exports = { sign, verify };
