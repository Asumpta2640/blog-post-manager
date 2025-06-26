// ✅ You can replace this with your actual API later
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Load and display all posts
function displayPosts() {
    const postList = document.getElementById('post-list');
    postList.innerHTML = '<p>Loading posts...</p>';

    fetch(BASE_URL)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(posts => {
            postList.innerHTML = '';
            posts.slice(0, 10).forEach(post => appendPostToList(post)); // limit to 10 demo posts

            if (posts.length > 0) {
                handlePostClick(posts[0].id);
            } else {
                document.getElementById('post-detail').innerHTML = '<p>No posts available.</p>';
            }
        })
        .catch(error => {
            console.error('Failed to fetch posts:', error);
            postList.innerHTML = '<p>Error loading posts.</p>';
        });
}

// Handle submission for adding or editing a post
function addNewPostListener() {
    const form = document.getElementById('edit-post-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const postId = form.dataset.id;
        const title = document.getElementById('edit-title').value.trim();
        const content = document.getElementById('edit-content').value.trim();

        if (!title || !content) {
            alert('Title and content are required.');
            return;
        }

        const postData = { title, body: content };
        const method = postId ? 'PATCH' : 'POST';
        const url = postId ? `${BASE_URL}/${postId}` : BASE_URL;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(post => {
                form.reset();
                form.classList.add('hidden');
                delete form.dataset.id;
                displayPosts();
                handlePostClick(post.id);
            })
            .catch(error => {
                console.error('Failed to save post:', error);
                alert('Failed to save post. Please try again.');
            });
    });
}

// Create post element and append to list
function appendPostToList(post) {
    const postList = document.getElementById('post-list');
    const postItem = document.createElement('div');

    postItem.textContent = post.title;
    postItem.classList.add('post-item');
    postItem.dataset.id = post.id;

    postItem.addEventListener('click', () => handlePostClick(post.id));
    postList.appendChild(postItem);
}

// Show the form with values to edit an existing post
function showEditForm(post) {
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');

    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.body;
    form.dataset.id = post.id;
}

// Cancel editing
function addEditFormListeners() {
    const form = document.getElementById('edit-post-form');
    const cancelBtn = document.getElementById('cancel-edit');

    if (!form || !cancelBtn) return;

    cancelBtn.addEventListener('click', () => {
        form.classList.add('hidden');
        form.reset();
        delete form.dataset.id;
    });
}

// Delete a post and refresh the list
function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.text();
        })
        .then(() => {
            displayPosts();
            document.getElementById('post-detail').innerHTML = '<p>Select a post to view its content.</p>';
        })
        .catch(error => {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post. Please try again.');
        });
}

// Show details for a specific post
function handlePostClick(id) {
    fetch(`${BASE_URL}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(post => {
            const postDetail = document.getElementById('post-detail');
            postDetail.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <button id="edit-btn">Edit</button>
                <button id="delete-btn">Delete</button>
            `;

            document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
            document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
        })
        .catch(error => {
            console.error('Failed to load post details:', error);
            document.getElementById('post-detail').innerHTML = '<p>Error loading post.</p>';
        });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    addNewPostListener();
    addEditFormListeners();
});
