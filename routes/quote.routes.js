const router = require('express').Router();
const axios = require('axios');

const Quote = require('../models/Quote.model');
const User = require('../models/User.model');
const quoteAPI = 'https://api.quotable.io';

// Get Random Quote
router.get('/quotes/random', (req, res, next) => {
  axios
    .get(`${quoteAPI}/random`)
    .then((response) => res.status(200).json(response.data))
    .catch((err) => res.json(err));
});

// Search a Quote
router.get('/quotes/search', (req, res, next) => {
  axios
    .get(`${quoteAPI}/search/quotes`)
    .then((response) => res.status(200).json(response.data))
    .catch((err) => res.json(err));
});

// Create a Quote in Database ??? Create a quote also in favorites ???
router.post('/quotes/', (req, res, next) => {
  const { content, author, minLength, maxLength, userId } = req.body;

  Quote.create({ content, author, minLength, maxLength, user: userId })
    .then((newQuote) => {
      return User.findByIdAndUpdate(userId, {
        $push: { favorites: newQuote._id },
      });
    })
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
