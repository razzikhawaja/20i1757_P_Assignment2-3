// controllers/blogPostController.js

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

// Import your blog post model
const BlogPost = require('../models/BlogPost');

// Route for creating a new blog post
router.post('/posts', authMiddleware, [
  check('title', 'Title is required').notEmpty(),
  check('content', 'Content is required').notEmpty(),
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;

  try {
    // Create a new blog post
    const newBlogPost = new BlogPost({
      title,
      content,
      author: req.user.id,
    });

    // Save the new blog post to the database
    await newBlogPost.save();

    res.json(newBlogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for updating a blog post
router.put('/posts/:postId', authMiddleware, [
  check('title', 'Title is required').notEmpty(),
  check('content', 'Content is required').notEmpty(),
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;

  try {
    // Find the blog post by ID
    let blogPost = await BlogPost.findById(req.params.postId);

    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Check if the user is the author of the blog post
    if (blogPost.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this blog post' });
    }

    // Update blog post fields
    blogPost.title = title;
    blogPost.content = content;

    // Save the updated blog post to the database
    await blogPost.save();

    res.json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for deleting a blog post
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    // Find the blog post by ID
    let blogPost = await BlogPost.findById(req.params.postId);

    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Check if the user is the author of the blog post
    if (blogPost.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this blog post' });
    }

    // Remove the blog post from the database
    await blogPost.remove();

    res.json({ msg: 'Blog post deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for retrieving all blog posts with pagination and filtering
router.get('/posts', async (req, res) => {
  try {
    // Implement pagination and filtering based on query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogPosts = await BlogPost.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username') // Populate author field with username
      .sort({ creationDate: -1 }); // Sort by creation date in descending order

    res.json(blogPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
