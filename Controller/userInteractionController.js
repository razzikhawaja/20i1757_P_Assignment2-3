// controllers/userInteractionController.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Import your follower, like, and notification models
const Follower = require('../models/Follower');
const Like = require('../models/Like');
const Notification = require('../models/Notification');

// Route for a user to follow another user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user is trying to follow themselves
    if (userId === req.user.id) {
      return res.status(400).json({ msg: 'Cannot follow yourself' });
    }

    // Check if the user to be followed exists
    const followee = await User.findById(userId);
    if (!followee) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the user is already following the specified user
    const existingFollower = await Follower.findOne({ follower: req.user.id, followee: userId });
    if (existingFollower) {
      return res.status(400).json({ msg: 'You are already following this user' });
    }

    // Create a new follower relationship
    const newFollower = new Follower({
      follower: req.user.id,
      followee: userId,
    });

    await newFollower.save();

    // Create a notification for the user being followed
    const newNotification = new Notification({
      type: 'follow',
      relatedUser: req.user.id,
      recipient: userId,
    });

    await newNotification.save();

    res.json({ msg: 'You are now following the user' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for displaying a user's feed
router.get('/feed', authMiddleware, async (req, res) => {
  try {
    // Get the users that the current user is following
    const following = await Follower.find({ follower: req.user.id }).select('followee');

    // Extract the user IDs from the following array
    const followingIds = following.map(follow => follow.followee);

    // Get the blog posts of the users that the current user is following
    const feed = await BlogPost.find({ author: { $in: followingIds } })
      .populate('author', 'username')
      .sort({ creationDate: -1 });

    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for handling notifications
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    // Get notifications for the current user
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('relatedUser', 'username');

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
