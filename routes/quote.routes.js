const router = require('express').Router();
const axios = require('axios');

const Quote = require('../models/Quote.model');
const User = require('../models/User.model');
const quoteAPI = 'https://api.quotable.io';

// Get Random Quote from external API
router.get('/quotes/random', (req, res, next) => {
  axios
    .get(`${quoteAPI}/random`)
    .then((response) => res.status(200).json(response.data))
    .catch((err) => res.json(err));
});

// Search a Quote from external API
router.get('/quotes/search', (req, res, next) => {
  const { query } = req.body;
  axios
    .get(`${quoteAPI}/search/quotes`)
    .then((response) => res.status(200).json(response.data))
    .catch((err) => {
      res.json(err);
    });
});

// Create a Quote in Database and send to User favorites
router.post('/quotes/addFavorite', (req, res, next) => {
  const { content, author, minLength, maxLength, userId } = req.body;

  Quote.create({ content, author, minLength, maxLength })
    .then((newQuote) => {
      return User.findByIdAndUpdate(userId, {
        $push: { favorites: newQuote._id },
      });
    })
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
});

//Get all Favorite Quotes from a User
router.get('/quotes/all-favorites/:userId', (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate('favorites')
    .then((favoriteQuotes) => res.status(200).json(favoriteQuotes))
    .catch((err) => res.json(err));
});

//Get One Quote by Id from the Database
router.get('/quotes/:quoteId', (req, res, next) => {
  const { quoteId } = req.params;

  Quote.findById(quoteId)
    .then((favoriteQuote) => res.status(200).json(favoriteQuote))
    .catch((err) => res.json(err));
});

// Edit One Quote by ID from the Database
router.put('/quotes/:quoteId', (req, res, next) => {
  const { quoteId } = req.params;
  const { content, author, minLength, maxLength } = req.body;

  Quote.findByIdAndUpdate(
    quoteId,
    { content, author, minLength, maxLength },
    { new: true }
  )
    .then((favoriteQuote) => res.status(201).json(favoriteQuote))
    .catch((err) => res.json(err));
});

// Delete One Quote by ID from the Database
router.delete('/quotes/:quoteId/:userId', (req, res, next) => {
  const { quoteId, userId } = req.params;

  Quote.findByIdAndDelete(quoteId)
    .then(() => {
      return User.findByIdAndUpdate(userId, {
        $pull: {
          favorites: quoteId,
        },
      });
    })
    .then(() => {
      res.status(200).json({
        message: `The quote with the id ${quoteId} was sucefully deleted`,
      });
    })

    .catch((err) => res.json(err));
});

module.exports = router;
