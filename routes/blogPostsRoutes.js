const express = require('express');
const router = express.Router();
const blogPostsController = require('../controllers/blogPostsController');
const authenticateToken = require('../middleware/authenticateToken');

// GET - /api/blogposts - get all blog posts
router.get('/blogposts', blogPostsController.getAllBlogPosts);

// GET - /api/blogposts/:id - get a blog post by the id
router.get('/blogposts/:id', blogPostsController.getBlogPostById);

// POST - /api/blogposts - create a new blog post
router.post('/blogposts', blogPostsController.createBlogPost);

// PUT - /api/blogposts/:id - update a blog post by id
router.put('/blogposts/:id', authenticateToken, blogPostsController.updateBlogPostById);

// DELETE - /api/blogposts/:id - delete a blog post by id
router.delete('/blogposts/:id', authenticateToken, blogPostsController.deleteBlogPostById);

module.exports = router;