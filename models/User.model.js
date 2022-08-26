const { Schema, model } = require('mongoose');

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
      set: capitalize,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      set: capitalize,
    },
    profileImg: {
      type: String,
      default:
        'https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png',
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Quote' }],
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
