const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

//Register
router.post('/register', async(req,res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        if(!name || !password) {
            return res.status(400).json({ message: 'Name and Password are required' });
        }
        if(!email && !phone) {
            return res.status(400).json({ message: 'Either mail or phone is required' });
        }
        if(!['admin', 'recruiter', 'candidate'].includes(role)) {
            return res.status(400).json({ message: 'Invalid Role' });
        }
        if(email) {
            const existingEmail = await User.findOne({ email });
            if(existingEmail) return res.status(400).json({ message: "Email already in use" });
        }
        const existingPhone = await User.findOne({ phone });
        if(existingPhone) return res.status(400).json({ message: "Phone Number already in use" });
        const user = new User({ name, email, phone, password, role });
        await user.save();
        const token = signToken(user);
        res.status(201).json({ token, user: {id: user._id, name: user.name, email: user.email, phone: user.phone, password: user.password, role: user.role} })
    } catch(err) {
        res.status(500).json({ message: 'Unable to register, Server Error occured' });
    }
});

//Login
router.post('/login', async(req,res) => {
    try {
        const {email, phone, password} = req.body;
        if((!email && !phone) || !password) {
            return res.status(400).json({ message: 'Email/Phone and password is required' });
        }
        // find user by email or phone 
        let user = null;
        if(email) user = await User.findOne({ email });
        if(!user && phone) user = await User.findOne({ phone });

        if(!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);
        res.json({
            token, 
            user: {id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role}
        });
    } catch(err) {
        res.status(500).json({ message: 'Server Error -' });
    }
});

module.exports = router;