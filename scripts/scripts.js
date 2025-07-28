const blogDataUrl = 'https://cmoore322.github.io/blog-json/blog.json';
let blogPosts = [];
let searchTerm = '';
let sortOption = 'date-desc';
let filterTag = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogData();
    document.getElementById('refreshDataBtn').addEventListener('click', fetchBlogData);
    document.getElementById('addPostForm').addEventListener('submit', handleAddPost);
    document.getElementById('goToBlogBtn').addEventListener('click', () => {
        window.location.href = 'https://github.com/cmoore322';
    });
    document.getElementById('searchInput').addEventListener('input', e => {
        searchTerm = e.target.value.toLowerCase();
        displayBlogPosts();
    });
    document.getElementById('sortSelect').addEventListener('change', e => {
        sortOption = e.target.value;
        displayBlogPosts();
    });
    document.getElementById('filterTagInput').addEventListener('input', e => {
        filterTag = e.target.value.toLowerCase();
        displayBlogPosts();
    });
});

async function fetchBlogData() {
    try {
        const response = await fetch(blogDataUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        blogPosts = await response.json();
        displayBlogPosts();
    } catch (error) {
        document.getElementById('blogPostsList').innerHTML = '<p>Failed to load blog data.</p>';
    }
}

function displayBlogPosts() {
    const blogPostsList = document.getElementById('blogPostsList');
    blogPostsList.innerHTML = '';
    let filtered = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                              post.content.toLowerCase().includes(searchTerm);
        const matchesTag = !filterTag || (post.tags && post.tags.some(tag => tag.toLowerCase().includes(filterTag)));
        return matchesSearch && matchesTag;
    });
    filtered.sort((a, b) => {
        if (sortOption === 'date-desc') return b.date.localeCompare(a.date);
        if (sortOption === 'date-asc') return a.date.localeCompare(b.date);
        if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
        if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
        return 0;
    });
    if (filtered.length === 0) {
        blogPostsList.innerHTML = '<p>No blog posts to display.</p>';
        return;
    }
    filtered.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Author:</strong> ${post.author}</p>
            <p><strong>Date:</strong> ${post.date}</p>
            <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
            <p><strong>Tags:</strong> ${post.tags ? post.tags.join(', ') : 'None'}</p>
            <button class="btn btn-primary btn-sm view-btn" data-id="${post.id}">View</button>
            <button class="btn btn-secondary btn-sm edit-btn" data-id="${post.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${post.id}">Delete</button>
        `;
        blogPostsList.appendChild(postDiv);
    });
    document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', handleEditPost));
    document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDeletePost));
    document.querySelectorAll('.view-btn').forEach(button => button.addEventListener('click', handleViewPost));
}

function handleAddPost(event) {
    event.preventDefault();
    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const date = document.getElementById('postDate').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const newPost = {
        id: String(Date.now()),
        title,
        author,
        date,
        content,
        tags
    };
    blogPosts.push(newPost);
    displayBlogPosts();
    document.getElementById('addPostForm').reset();
    alert('Post added! (Note: Changes are not permanent)');
}

function handleEditPost(event) {
    const postId = event.target.dataset.id;
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        const currentPost = blogPosts[postIndex];
        const newTitle = prompt('Enter new title:', currentPost.title);
        if (newTitle === null) return;
        const newAuthor = prompt('Enter new author:', currentPost.author);
        if (newAuthor === null) return;
        const newDate = prompt('Enter new date (YYYY-MM-DD):', currentPost.date);
        if (newDate === null) return;
        const newContent = prompt('Enter new content:', currentPost.content);
        if (newContent === null) return;
        const newTags = prompt('Enter new tags (comma-separated):', currentPost.tags ? currentPost.tags.join(', ') : '');
        if (newTags === null) return;
        blogPosts[postIndex] = {
            ...currentPost,
            title: newTitle,
            author: newAuthor,
            date: newDate,
            content: newContent,
            tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };
        displayBlogPosts();
        alert('Post updated! (Note: Changes are not permanent)');
    }
}

function handleDeletePost(event) {
    const postId = event.target.dataset.id;
    if (confirm('Are you sure you want to delete this post?')) {
        blogPosts = blogPosts.filter(post => post.id !== postId);
        displayBlogPosts();
        alert('Post deleted! (Note: Changes are not permanent)');
    }
}

function handleViewPost(event) {
    const postId = event.target.dataset.id;
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        document.getElementById('postModalLabel').textContent = post.title;
        document.getElementById('postModalBody').innerHTML = `
            <p><strong>Author:</strong> ${post.author}</p>
            <p><strong>Date:</strong> ${post.date}</p>
            <p>${post.content}</p>
            <p><strong>Tags:</strong> ${post.tags ? post.tags.join(', ') : 'None'}</p>
        `;
        const modal = new bootstrap.Modal(document.getElementById('postModal'));
        modal.show();
    }
}
