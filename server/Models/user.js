const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User Schema
const UserSchema = new Schema({
    firstName: { type: String, require: true, maxLength: 150 },
    lastName: { type: String, require: true, maxLength: 150 },
    email: { type: String, require: true, maxLength: 150 },
    phone: { type: String, require: true, maxLength: 15 },
    password: { type: String, require: true, maxLength: 150 },
    createdAt: { type: Date, require: true, default: new Date() },
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
});

module.exports = mongoose.model('User', UserSchema);