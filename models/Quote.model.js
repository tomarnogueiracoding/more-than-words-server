const { Schema, model } = require('mongoose');

const quoteSchema = new Schema(
  {
    content: {
      type: String,
    },
    author: {
      type: String,
    },
    minLength: {
      type: Number,
    },
    maxLength: {
      type: Number,
    },
    tags: {
      type: String,
      enum: ['famous-quotes', 'inspirational', 'wisdom'],
    },
    playlist: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  },
  {
    timestamps: true,
  }
);

const Quote = model('Quote', quoteSchema);

module.exports = Quote;
