const { Schema, model } = require('mongoose');

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      unique: [true, 'Username is already taken'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        'Please use a valid email address',
      ],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      set: capitalize,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
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
