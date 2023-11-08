const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
});

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;
