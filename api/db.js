const Redis = require('ioredis');

// Use the environment variable if available, otherwise use the provided string (Fallback for easy setup)
const CONNECTION_STRING = process.env.REDIS_URL;

let client;

if (!client) {
    client = new Redis(CONNECTION_STRING);
}

module.exports = client;
