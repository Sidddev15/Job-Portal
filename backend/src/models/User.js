const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, sparse: true},
    password: {type: String, required: true, sparse: true},
    phone: {type: Number, required: true},
    role: {
        type: String, 
        enum: ['admin', 'recruiter', 'candidate'],
        default: 'candidate',
        required: true,
    },
    avatar: {type: String},
    resumeURL: {type: String},
}, {timestamps: true});

// Hash password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password for login
userSchema.methods.comparePassword = function (inputPassowrd) {
    return bcrypt.compare(inputPassowrd, this.password);
};

module.exports = mongoose.model('User', userSchema);