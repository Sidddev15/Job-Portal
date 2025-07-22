const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function authMiddleware(req,res,next) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({ message: "No token, auth denied" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if(!req.user) throw new Error('User Not Found');
        next();
    } catch(err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
}

module.exports = authMiddleware;