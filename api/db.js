const Redis = require('ioredis');

// Use the environment variable if available, otherwise use the provided string (Fallback for easy setup)
const CONNECTION_STRING = process.env.REDIS_URL || "redis://default:vY5BkMAx0aCmmk7pqxm1SecS4yDptdBX@redis-14999.c311.eu-central-1-1.ec2.cloud.redislabs.com:14999";

let client;

if (!client) {
    client = new Redis(CONNECTION_STRING);
}

module.exports = client;
