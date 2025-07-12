const redisClient = require('../config/redisClient');
const userRepo = require('../repositories/user.repository');

const USERS_KEY = 'users:all';

exports.getUsers = async () => {
    // checks cached first
    const cached = await redisClient.get(USERS_KEY);
    if(cached) {
        console.log("Serving from cache");
        return JSON.parse(cached);
    }

    // else fetch from DB
    const users = await userRepo.fetchAllUsers();

    //set in cache for future
    await redisClient.set(USERS_KEY, JSON.stringify(users), {
        EX: 60,
    });

    console.log('Fetched from DB & cached');
  return users;
}