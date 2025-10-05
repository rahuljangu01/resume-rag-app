const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const { sendVerificationEmail } = require('../services/email.service');
const crypto = require('crypto');
const { CLIENT_URL } = require('../config/constants');

exports.registerUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ email, password, role });
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = Date.now() + 3600000;
    await user.save();
    try {
        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful. Please check your email to verify your account.' 
        });
    } catch (error) {
        res.status(500);
        throw new Error('Email could not be sent. Please try again.');
    }
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    if (!user.isVerified) {
        res.status(403);
        throw new Error('Please verify your email before logging in.');
    }
    if (await user.matchPassword(password)) {
        res.json({
            _id: user.id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

exports.verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpires: { $gt: Date.now() }
    });
    if (!user) {
        return res.redirect(`${CLIENT_URL}/verification-failed`);
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    res.redirect(`${CLIENT_URL}/email-verified`);
});

exports.resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user.isVerified) {
        res.status(400);
        throw new Error('This account is already verified.');
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = Date.now() + 3600000;
    await user.save();
    await sendVerificationEmail(user.email, verificationToken);
    res.status(200).json({ success: true, message: 'Verification email resent successfully.' });
});