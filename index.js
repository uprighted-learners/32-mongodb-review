// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// create express app
const app = express();

// implement middleware
app.use(express.json());
app.use(cors());

// declare a PORT
const PORT = process.env.PORT || 8080;

// GET - /api/health - check if API is alive or not
app.get("/api/health", async (req, res) => {
    try {
        res.send("Server is running");
    } catch (error) {
        console.log(error);
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// middleware to authenticate JSON Web Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // BEARER TOKEN
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
};

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a model for Blog Post
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a model for a User
const User = mongoose.model('User', userSchema);

// GET - /api/blogposts - get all blog posts
app.get("/api/blogposts", async (req, res) => {
    try {
        const posts = await BlogPost.find({});
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "No blog posts found" });
    }
})

// GET - /api/blogposts/:id - get a blog post by the id
app.get("/api/blogposts/:id", async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Blog post not found" });
    }
})

// POST - /api/blogposts - create a new blog post
app.post("/api/blogposts", async (req, res) => {
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
})

// PUT - /api/blogposts/:id - update a blog post by id
app.put("/api/blogposts/:id", authenticateToken, async (req, res) => {
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
});

// DELETE - /api/blogposts/:id - delete a blog post by id
app.delete("/api/blogposts/:id", authenticateToken, async (req, res) => {
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
});

// POST - /api/register - register a new user
app.post("/api/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
})

// POST - /api/login - login a user
app.post("/api/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token: accessToken });
        } else {
            res.send("Invalid credentials");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
})

// spin up the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});