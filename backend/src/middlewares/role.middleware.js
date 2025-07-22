const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

function requireRole(roles) {
    return (req,res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient Role' });
        }
        next();
    };
}

module.exports = {requireRole};