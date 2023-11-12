// controllers/searchController.js

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import your blog post model
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

// Route for searching blog posts based on keywords, categories, and authors
router.get('/search', async (req, res) => {
  try {
    const { keywords, category, author } = req.query;

    // Build the query object based on search parameters
    const query = {};

    if (keywords) {
      query.$text = { $search: keywords };
    }

    if (category) {
      query.category = category;
    }

    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        query.author = authorUser.id;
      } else {
        return res.status(404).json({ msg: 'Author not found' });
      }
    }

    // Execute the search query
    const searchResults = await BlogPost.find(query).populate('author', 'username');

    res.json(searchResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
