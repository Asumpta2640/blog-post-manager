const postListDiv = document.getElementById('post-list');
const postDetailDiv = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');

function displayPosts() {
  fetch('http://localhost:3000/posts')
    .then(resp => resp.json())
    .then(data => {
      // The API wraps posts in a 'posts' array
      const posts = data.posts || data; // Use data.posts if available, otherwise data
      postListDiv.innerHTML = '';
      posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.textContent = post.title || post.content || '';
        postElement.style.cursor = 'pointer';
        postElement.dataset.id = post.id;
        postListDiv.appendChild(postElement);
        postElement.addEventListener('click', () => handlePostClick(post.id));
        if (index === 0) {
          handlePostClick(post.id);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      postListDiv.innerHTML = ``;
    })
};

function handlePostClick(postId) {
  fetch(`http://localhost:3000/posts/${postId}`)
    .then(resp => resp.json())
  .then(post => {
    postDetailDiv.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <p><em>by User ${post.userId}</em></p>
      <button id="edit-btn">Edit</button>
    `;
    document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
  })
  .catch(error => {
    console.error('Error fetching post:', error);
    postDetailDiv.innerHTML = `<p>Error loading post details. Please try again later.</p>`;
  })
};


function showEditForm(post) {
  postDetailDiv.innerHTML = `
    <form id="edit-post-form">
      <input type="text" name="title" value="${post.title}" /><br>
      <textarea name="content">${post.content}</textarea><br>
        <input type="text" name="imageUrl" value="${post.imageUrl}" /><br>
      <button type="submit">Update</button>
    </form>
  `;

  document.getElementById('edit-post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedTitle = e.target.title.value;
    const updatedContent = e.target.content.value;
    const updatedImageUrl = e.target.imageUrl.value;

    // Send PATCH request to backend
    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: updatedTitle,
        body: updatedContent,
        imageUrl: updatedImageUrl
      })
    })
    .then(resp => resp.json())
    .then(updatedPost => {
      // Update UI with new data
      postDetailDiv.innerHTML = `
        <h2>${updatedPost.title}</h2>
        <p>${updatedPost.body}</p>
        <p><em>by User ${updatedPost.userId || post.userId || post.author || 'Unknown'}</em></p>
        <button id="edit-btn">Edit</button>
      `;
      document.getElementById('edit-btn').addEventListener('click', () => showEditForm(updatedPost));
        // Refresh the post list
        const postElement = [...postListDiv.children].find(div => div.dataset.id == post.id);
        if (postElement) postElement.textContent = updatedPost.title;
    })
    .catch(error => {
        alert('Failed to update post.');
        console.error(error);
    })
  })
};

function addNewPostListener() {
  newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const author = e.target.author.value;

    const post = { title, content, author };
    const postElement = document.createElement('div');
    postElement.textContent = post.title;
    postElement.style.cursor = 'pointer';

    postListDiv.appendChild(postElement);
    postElement.addEventListener('click', () => {
      postDetailDiv.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><em>by ${post.author}</em></p>
      `;
    });

    newPostForm.reset();
  });
}
// Function to apply toggle functionality to elements within a given container
function applyToggleFunctionality(containerElement) {
    // Get all toggle triggers within the specified container
    const toggleTriggers = containerElement.querySelectorAll('.toggle-trigger');

    toggleTriggers.forEach(trigger => {
        // Find the next sibling element that has the class 'expandable-content'
        const content = trigger.nextElementSibling;

        // Ensure we only apply if both trigger and content exist and are correctly structured
        if (trigger && content && content.classList.contains('expandable-content')) {
            // Remove any existing listeners to prevent duplicates if called multiple times
            // (e.g., when reloading post details)
            const oldClickListener = trigger.__toggleClickListener; // Store reference
            if (oldClickListener) {
                trigger.removeEventListener('click', oldClickListener);
            }

            const newClickListener = () => {
                content.classList.toggle('show');

                // Update trigger text for clarity
                if (content.classList.contains('show')) {
                    trigger.textContent = 'Read Less';
                } else {
                    trigger.textContent = 'Read More';
                }
            };

            trigger.addEventListener('click', newClickListener);
            trigger.__toggleClickListener = newClickListener; // Store reference for removal
        }
    });
}

function main() {
  document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    addNewPostListener();
  });
}
main();