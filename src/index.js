const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch and display all posts
function displayPosts() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            posts.slice(0, 10).forEach(post => {
                const postItem = document.createElement('div');
                postItem.textContent = post.title;
                postItem.classList.add('post-item');
                postItem.dataset.id = post.id;

                postItem.addEventListener('click', () => handlePostClick(post.id));
                postList.appendChild(postItem);
            });

            if (posts.length > 0) {
                handlePostClick(posts[0].id);
            }
        })
        .catch(error => {
            console.error('Failed to load posts:', error);
        });
}

// Handle clicking on a post to view its details
function handlePostClick(id) {
    fetch(`${BASE_URL}/${id}`)
        .then(res => res.json())
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
        });
}

// Show the edit form with the post's data
function showEditForm(post) {
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');

    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.body;
    form.dataset.id = post.id;
}

// Cancel edit
function addEditFormListeners() {
    const cancelBtn = document.getElementById('cancel-edit');
    const form = document.getElementById('edit-post-form');

    cancelBtn.addEventListener('click', () => {
        form.classList.add('hidden');
        form.reset();
        delete form.dataset.id;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const postId = form.dataset.id;
        const updatedPost = {
            title: document.getElementById('edit-title').value,
            body: document.getElementById('edit-content').value
        };

        fetch(`${BASE_URL}/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPost)
        })
            .then(res => res.json())
            .then(post => {
                form.reset();
                form.classList.add('hidden');
                delete form.dataset.id;
                displayPosts();
                handlePostClick(post.id);
            })
            .catch(error => {
                console.error('Failed to update post:', error);
            });
    });
}

// Add new post
function addNewPostListener() {
    const form = document.getElementById('new-post-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPost = {
            title: document.getElementById('new-title').value,
            body: document.getElementById('new-content').value,
            author: document.getElementById('new-author').value || 'Anonymous'
        };

        fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        })
            .then(res => res.json())
            .then(post => {
                form.reset();
                displayPosts();
                handlePostClick(post.id);
            })
            .catch(error => {
                console.error('Failed to create new post:', error);
            });
    });
}

// Delete post
function deletePost(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            displayPosts();
            document.getElementById('post-detail').innerHTML = '<p>Select a post to view its content.</p>';
        })
        .catch(error => {
            console.error('Failed to delete post:', error);
        });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    addEditFormListeners();
    addNewPostListener();
});
