document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
    // clear inputs
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
});

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

function login(username, password) {
    fetch("https://three2-mongodb-review.onrender.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error during login");
            }
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            alert("Login successful");
            loadPosts();
        })
        .catch(error => {
            alert(error.message);
        });
}

function loadPosts() {
    fetch("https://three2-mongodb-review.onrender.com/api/blogposts")
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById("postsList");
            postsList.innerHTML = "";
            posts.forEach(post => {
                const li = document.createElement("li");
                li.textContent = `${post.title} by ${post.author} and the body is ${post.body}`;
                if (localStorage.getItem("token")) {
                    const editButton = document.createElement("button");
                    editButton.textContent = "Edit";
                    editButton.onclick = function () { editPost(post._id); };
                    li.appendChild(editButton);

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.onclick = function () { deletePost(post._id) }
                    li.appendChild(deleteButton);
                }
                postsList.appendChild(li);
            })
        })
}

function createPost(title, author, body) {
    fetch("https://three2-mongodb-review.onrender.com/api/blogposts", {
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

function editPost(id) {
    const title = prompt("New title:");
    const author = prompt("New author:");
    const body = prompt("New body:");
    fetch(`https://three2-mongodb-review.onrender.com/api/blogposts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, author, body })
    })
        .then(response => {
            if (response.ok) {
                alert("Post updated!");
                loadPosts(); // reload the list of posts
            } else {
                alert("Error updating post");
            }
        })
        .catch(error => {
            alert("Error updating post: " + error);
        })
}

function deletePost(id) {
    fetch(`https://three2-mongodb-review.onrender.com/api/blogposts/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Post deleted!");
                loadPosts(); // reload the list of posts
            } else {
                alert("Error deleting post");
            }
        })
        .catch(error => {
            alert("Error deleting post: " + error);
        })
}

loadPosts();