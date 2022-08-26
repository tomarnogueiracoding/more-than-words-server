const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const router = require('express').Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', (req, res, next) => {
  const { email, password, firstname, lastname } = req.body;

  // Check if email, username, password, first name, or last name are provided as empty string
  if (email === '' || password === '' || firstname === '' || lastname === '') {
    res.status(400).json({ message: 'Please complete all fields' });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Please provide a valid email adress' });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter',
    });
    return;
  }
  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUserEmail) => {
      if (foundUserEmail) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      // If email and username are unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({
        email,
        password: hashedPassword,
        firstname,
        lastname,
      });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, firstname, lastname } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, firstname, lastname };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if ((email === '') | (password === '')) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      // Compare the provided password with the one saved in the database
      bcrypt.compare(password, user.password).then((passwordCorrect) => {
        if (!passwordCorrect) {
          return res.status(400).json({ message: 'Wrong credentials' });
        } else {
          // Deconstruct the user object to omit the password
          const { email, _id, firstname, lastname, profileImg, favorites } =
            user;

          // Create an object that will be set as the token payload
          const payload = {
            email,
            firstname,
            lastname,
            profileImg,
            favorites,
            _id,
          };

          // Create and sign the token
          const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '14d',
          });

          // Send the token as the response
          return res.status(200).json({ authToken: authToken });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({ message: 'Unable to authenticate the user' });
    });
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
