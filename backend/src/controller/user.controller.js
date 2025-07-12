const userService = require('../services/user.service');

exports.getAllUsers = async (req,res) => {
    const users = await userService.getUsers();
    res.json(users); 
};