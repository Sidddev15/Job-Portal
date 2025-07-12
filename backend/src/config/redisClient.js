//Redis = super fast memory store => Great for caching expensive DB Queries, Storing session data/ tokens, Rate Limiting
const {createClient} = require('redis');

const redisClient = createClient();
redisClient.on('error', (err) => console.error("Redis client error", err));
redisClient.connect();

module.exports = redisClient;