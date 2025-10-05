const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
dotenv.config({ path: __dirname + '/../../.env' });
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
const importData = async () => {
    try {
        await User.deleteMany({ email: 'admin@mail.com' });
        const adminUser = {
            email: 'admin@mail.com',
            password: 'admin123',
            role: 'recruiter',
            isVerified: true
        };
        await User.create(adminUser);
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@mail.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
const seedData = async () => {
    await connectDB();
    await importData();
    process.exit();
};
seedData();