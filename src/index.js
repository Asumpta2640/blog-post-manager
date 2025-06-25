 const BASE_URL = 'https://example.com/posts'; // Replace with your real API

function displayPosts() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            posts.forEach(post => {
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
        });
}

function addNewPostListener() {
    const form = document.getElementById('edit-post-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const postId = form.dataset.id;
        const postData = {
            title: document.getElementById('edit-title').value,
            content: document.getElementById('edit-content').value
        };

        const method = postId ? 'PATCH' : 'POST';
        const url = postId ? `${BASE_URL}/${postId}` : BASE_URL;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then(post => {
                form.reset();
                form.classList.add('hidden');
                delete form.dataset.id;
                displayPosts();
                handlePostClick(post.id);
            });
    });
}

function appendPostToList(post) {
    const postList = document.getElementById('post-list');
    const postItem = document.createElement('div');
    postItem.textContent = post.title;
    postItem.classList.add('post-item');
    postItem.dataset.id = post.id;

    postItem.addEventListener('click', () => handlePostClick(post.id));
    postList.appendChild(postItem);
}

function showEditForm(post) {
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;
    form.dataset.id = post.id;
}

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

function deletePost(id) {
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
            displayPosts();
            document.getElementById('post-detail').innerHTML = '<p>Select a post to view its content.</p>';
        });
}

function handlePostClick(id) {
    fetch(`${BASE_URL}/${id}`)
        .then(res => res.json())
        .then(post => {
            const postDetail = document.getElementById('post-detail');
            postDetail.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <button id="edit-btn">Edit</button>
                <button id="delete-btn">Delete</button>
            `;
            document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
            document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
        });
}

// Initialize everything after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    addNewPostListener();
    addEditFormListeners();
});

   