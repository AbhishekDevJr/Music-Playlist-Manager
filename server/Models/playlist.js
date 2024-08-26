const mongoose = require('mongoose');;

//Song Schema nested in Playlist
const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true }
});

//Playlist Schema
const PlaylistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    songs: [SongSchema],
});

module.exports = mongoose.model('Playlist', PlaylistSchema);