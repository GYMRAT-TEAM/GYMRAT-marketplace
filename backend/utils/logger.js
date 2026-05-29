const morgan = require('morgan');

// Safe logger — NEVER logs passwords, tokens, or sensitive request bodies
const log = (level, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
};

module.exports = {
  info:  (msg) => log('info', msg),
  warn:  (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
  // Morgan HTTP logger — logs method, url, status, response time only
  httpLogger: morgan(':method :url :status :res[content-length] - :response-time ms'),
};
