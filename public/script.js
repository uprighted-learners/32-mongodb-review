document.getElementById('postForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = document.getElementById('body').value;
    createPost(title, author, body);
    // clear inputs
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('body').value = "";
});

function loadPosts() {
    fetch("/api/blogposts")
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById("postsList");
            postsList.innerHTML = "";
            posts.forEach(post => {
                const li = document.createElement("li");
                li.textContent = `${post.title} by ${post.author}`;
                postsList.appendChild(li);
            })
        })
}

function createPost(title, author, body) {
    fetch("/api/blogposts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, author, body })
    })
        .then(response => response.json())
        .then(post => {
            alert("Post created!")
            loadPosts(); // reload the list of posts
        })
        .catch(error => {
            alert("Error creating post: " + error);
        })
};

loadPosts();