const router = require('express').Router();
const User = require('../models/User.model');
const Quote = require('../models/Quote.model');

// Get all users

router.get('/users', (req, res, next) => {
  User.find()
    .then((user) => res.status(200).json(user))
    .catch((err) => res.json(err));
});

// Get a user by ID
router.get('/users/:userId', (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.json(err));
});

// Edit a user by ID
router.put('/users/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { firstname, lastname, profileImg } = req.body;

  User.findByIdAndUpdate(
    userId,
    { firstname, lastname, profileImg },
    { new: true }
  )
    .then((user) => res.status(201).json(user))
    .catch((err) => res.json(err));
});

// Delete a user by ID
router.delete('/users/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { firstname, lastname } = req.body;
  User.findByIdAndDelete(userId)
    .then(() =>
      res.status(201).json({
        message: `The user with user Id${userId} was deleted`,
      })
    )
    .catch((err) => res.json(err));
});

module.exports = router;
