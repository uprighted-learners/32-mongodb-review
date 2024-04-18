const BlogPost = require('../models/BlogPost');

// GET - /api/blogposts - get all blog posts
exports.getAllBlogPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({});
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "No blog posts found" });
    }
}

// GET - /api/blogposts/:id - get a blog post by the id
exports.getBlogPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Blog post not found" });
    }
}

// POST - /api/blogposts - create a new blog post
exports.createBlogPost = async (req, res) => {
    const post = new BlogPost({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
    })

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// PUT - /api/blogposts/:id - update a blog post by id
exports.updateBlogPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            post.title = req.body.title;
            post.author = req.body.author;
            post.body = req.body.body;
            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: "Blog post not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// DELETE - /api/blogposts/:id - delete a blog post by id
exports.deleteBlogPostById = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Blog post not found" });
            return;
        }
        res.json({ message: "Blog post deleted" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}