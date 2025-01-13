const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/users/register');
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Registration failed');
    res.redirect('/users/register');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.verifyPassword(password))) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/users/login');
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '1d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    req.flash('success_msg', 'You are now logged in');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Login failed');
    res.redirect('/users/login');
  }
};