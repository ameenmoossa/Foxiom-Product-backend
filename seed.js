const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional)
    // await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('staff123', 10);

    const staffUser = await User.findOneAndUpdate(
      { email: 'staff@foxiom.com' },
      {
        name: 'Staff User',
        email: 'staff@foxiom.com',
        password: hashedPassword,
        role: 'staff',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log('Staff user created:', staffUser.email);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedUsers();