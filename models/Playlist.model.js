const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
  playlist_id: {
    type: String,
  },
});

const Playlist = model('Playlist', playlistSchema);

module.exports = Playlist;
