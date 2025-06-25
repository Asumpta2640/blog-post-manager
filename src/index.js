  function displayPosts(){
    fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
        const postList = document.getElementById('post-list');
        postList.innerHTML = '';

        posts.forEach(post =>{
            const postItem = document.createElement('div');
            postItem.textContent = post.title;
            postItem.classList.add('post-item');
            postItem.dataset.id = post.id;

            postItem.addEventListener('click', () => handlepostClick(post.id))
            postList.appendChild(postItem);
        });
        if (post.length >0){
            handlepostClick(posts[0].id);
        }
    });
}

function addNewPostListener(){
    const form = document.getElementById('edit-post-form');
    if(!form) return;

    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        
        const newPost = {
            title:document.getElementById('edit-title').value,
            content:document.getElementById('edit-content').value
            
        };

        fetch(BASE_URL,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(newPost)
        })
        .then(res => res.json())
        .then(post =>{
            form.reset ();
            appendPostToList(post);
            handlepostClick(post.id);
        });
    });
}
function appendPostToList(post){
    const postList = document.getElementById('post-list');
    const postItem = document.createElement('div');
    postItem.textContent = post.title;
    postItem.classList.add('post-item');
    postItem.dataset.id = post.id;

    postItem.addEventListener('click', () =>handlepostClick(post.id));
    postList.appendChild(postItem);
}

function showEditForm(post){
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;
    form.dataset.id = post.id;
}
function addEditFormListeners(){
    const form =document.getElementById('edit-post-form');
    if(!form) return;

    form.addEventListener('submit',(e) =>{
        e.preventDefault();

        const newPost ={
            title:document.getElementById('edit-title').value,
            content:document.getElementById('edit-content').value
        };


        fetch(`${BASE_URL}/${id}`,{
            method:'Post',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(newPost)
        })
        .then(res => res.json())
        .then(post=>{
            form.reset();
            appendPostToList(post);
            handlepostClick(post.id); 
        });
});
}

function appendPostToList(post){
    const postList = document.getElementById('post-list');
    const postItem = document.createElement('div');
    postItem.textContent = post.title;
    postItem.classList.add('post-item');
    postItem.dataset.id = post.id;

    postItem.addEventListener('click', () => handlepostClick(post.id));
    postList.appendChild(postItem);
}
function showEditForm(post){
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;
    form.dataset.id = post.id;
}

function addEditFormListeners(){
    const form = document.getElementById('edit-post-form');
    const cancelBtn = document.getElementById('cancel-edit');

    if(!form) return;

    form.addEventListener('submit',(e) =>{
        e.preventDefault();
        const updatedPost={
            title:document.getElementById('edit-title').value,
            content:document.getElementById('edit-content').value
        };

        const id = form.dataset.id;

        fetch(`${BASE_URL}/${id}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(updatedPost)    
            })
            .then(res => res.json())
            .then(() =>{
                form.classList.add('hidden');
                displayPosts();
                handlepostClick(id);
            });
        });

    cancelBtn.addEventListener('click',()=> {
        form.classList.add('hidden');
    });
}

function deletePost(id){
    fetch(`${BASE_URL}/${id}`, {method:'DELETE'})
    .then(() =>{
        displayPosts();
        document.getElementById('post-detail').innerHTML= '<p>Select a post to view its content.</p>';
    });
}
function handlepostClick(id) {
    fetch(`${BASE_URL}/${id}`)
       .then(res => res.json())
       .then(post =>{
          const postDetail = document.getElementById('post-detail');
          postDetail.innerHTML =`
           <h2>${post.title}</h2>
           <p>${post.content}</p>
           <button onclick='showEditForm(${JSON.stringify(post)})'>Edit</button>
           <button onclick='deletePost(${post.id})'>Delete</button>
           `;
           
       });
    }

    document.addEventListener('DOMContentLoaded',()=>{
        displayPosts();
        addNewPostListener();
        addEditFormListeners();
    });
     
    
            
        
    
