const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, 'First name should have at least 3 characters'],
    },
    lastName: {
      type: String,
      minLength: [3, 'Last name should have at least 3 characters'],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: [5, 'Email must be at least 5 characters long'],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, 'Password must be at least 6 characters long'],
    select: false, // Exclude password by default
  }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  console.log("Entered Password Type:", typeof enteredPassword);
  console.log("Stored Hashed Password:", this.password);

  if (!enteredPassword || !this.password) {
    throw new Error("Password or hash is missing");
  }

  return await bcrypt.compare(String(enteredPassword), this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};



const User = mongoose.model('User', userSchema);
module.exports = User;