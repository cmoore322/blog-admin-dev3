const blogDataUrl = 'https://your-username.github.io/my-blog-data/blog-posts.json'; // IMPORTANT: Replace with your actual URL
let blogPosts = []; // This will hold your current blog data in memory

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogData();
    document.getElementById('refreshDataBtn').addEventListener('click', fetchBlogData);
    document.getElementById('addPostForm').addEventListener('submit', handleAddPost);
    document.getElementById('goToBlogBtn').addEventListener('click', () => {
        // Replace with the actual URL of your Dev Profile's blog section
        window.location.href = 'https://your-dev-profile.github.io/your-blog-section-path';
    });
});

async function fetchBlogData() {
    try {
        const response = await fetch(blogDataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        blogPosts = await response.json();
        displayBlogPosts();
        console.log('Blog data fetched:', blogPosts);
    } catch (error) {
        console.error('Error fetching blog data:', error);
        alert('Failed to load blog data. Please check the URL and try again.');
    }
}

function displayBlogPosts() {
    const blogPostsList = document.getElementById('blogPostsList');
    blogPostsList.innerHTML = ''; // Clear previous posts

    if (blogPosts.length === 0) {
        blogPostsList.innerHTML = '<p>No blog posts to display.</p>';
        return;
    }

    blogPosts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Author:</strong> ${post.author}</p>
            <p><strong>Date:</strong> ${post.date}</p>
            <p>${post.content}</p>
            <p><strong>Tags:</strong> ${post.tags ? post.tags.join(', ') : 'None'}</p>
            <button class="edit-btn" data-id="${post.id}">Edit</button>
            <button class="delete-btn" data-id="${post.id}">Delete</button>
        `;
        blogPostsList.appendChild(postDiv);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditPost);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeletePost);
    });
}

function handleAddPost(event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const date = document.getElementById('postDate').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const newPost = {
        id: String(Date.now()), // Simple unique ID
        title,
        author,
        date,
        content,
        tags
    };

    blogPosts.push(newPost);
    displayBlogPosts(); // Re-render the list

    // Clear the form
    document.getElementById('addPostForm').reset();
    alert('Post added! (Note: Changes are not permanent)');
}

function handleEditPost(event) {
    const postId = event.target.dataset.id;
    const postIndex = blogPosts.findIndex(post => post.id === postId);

    if (postIndex !== -1) {
        const currentPost = blogPosts[postIndex];

        const newTitle = prompt('Enter new title:', currentPost.title);
        if (newTitle === null) return; // User cancelled

        const newAuthor = prompt('Enter new author:', currentPost.author);
        if (newAuthor === null) return;

        const newDate = prompt('Enter new date (YYYY-MM-DD):', currentPost.date);
        if (newDate === null) return;

        const newContent = prompt('Enter new content:', currentPost.content);
        if (newContent === null) return;

        const newTags = prompt('Enter new tags (comma-separated):', currentPost.tags ? currentPost.tags.join(', ') : '');
        if (newTags === null) return;

        blogPosts[postIndex] = {
            ...currentPost, // Keep existing properties
            title: newTitle,
            author: newAuthor,
            date: newDate,
            content: newContent,
            tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };
        displayBlogPosts(); // Re-render the list
        alert('Post updated! (Note: Changes are not permanent)');
    }
}

function handleDeletePost(event) {
    const postId = event.target.dataset.id;
    if (confirm('Are you sure you want to delete this post?')) {
        blogPosts = blogPosts.filter(post => post.id !== postId);
        displayBlogPosts(); // Re-render the list
        alert('Post deleted! (Note: Changes are not permanent)');
    }
}
