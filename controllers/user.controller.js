
const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const { validationResult } = require('express-validator');



module.exports.registerUser = async (req, res, next) => {
     const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {firstName, lastName, email, password}= req.body;
  const user = await userService.createUser({
    firstName:firstName,
    lastName:lastName,
     email,
     password
    });
  
    const token = user.generateAuthToken();
    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
};
module.exports.loginUser = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide both email and password'
      });
    }

    // Find user
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      console.log("reached");
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Compare password
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Error verifying password',
        error: error.message
      });
    }

    // Generate token
    try {
      const token = user.generateAuthToken();
      
      // Remove password from user object before sending response
      user.password = undefined;

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.status(200).json({
        message: 'Logged in successfully',
        user,
        token
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error generating authentication token',
        error: error.message
      });
    }

  } catch (error) {
    next(error);
  }
};
module.exports.getUserProfile = async (req, res, next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  
  res.status(200).json({
    user: req.user,
  });
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

