# Blog Admin SPA

This project is a simple Single Page Application (SPA) demonstrating a full-stack CRUD app using Node.js, Express, MongoDB, and a RESTful API. It includes:

- Front-end SPA (Bootstrap 5, normalize.css, jQuery, jQuery UI)
- Back-end API (Express + Mongoose)
- Development tooling: nodemon, dotenv
- Deployment: Procfile provided for Render or similar PaaS

Author: Chris Moore (cmoore322)

Requirements
- Node 18+
- MongoDB (local or hosted)

Local setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` if needed.
2. Install dependencies: `npm install`.
3. Run in development with auto-reload: `npm run dev`.

API
- GET /api/posts - list posts
- POST /api/posts - create post { title, body, author?, tags? }
- GET /api/posts/:id - get post
- PUT /api/posts/:id - update post
- DELETE /api/posts/:id - delete post

Notes on security and production
- Secrets should be provided through environment variables in the host (Render, Heroku, etc.).
- `.env` is ignored in git via `.gitignore`.
- Helmet and CORS are enabled by default.
# Blog Admin Dev3

## Overview

**This Blog Admin** is a web-based admin panel for managing blog posts. Extra-credit opportunities were taken by implementing search and sort features along with a bs5 modal.

## Features

- **Add New Blog Posts:** Enter title, author, date, content, and tags.
- **Edit & Delete Posts:** Modify or remove existing posts with ease.
- **Search:** Instantly filter posts by title or content.
- **Sort:** Sort posts by date (newest/oldest) or title (A-Z/Z-A).
- **Tag Filter:** Filter posts by tag.
- **View Details:** Click to view full post details in a Bootstrap modal.
- **Responsive Design:** Works on desktop and mobile devices.
- **Modern UI:** Uses Bootstrap 5 and a custom SVG background for a clean look.
- **External Data:** Fetches blog data from a JSON file hosted at [https://cmoore322.github.io/blog-json/blog.json](https://cmoore322.github.io/blog-json/blog.json).

## How It Works

- On load, the app fetches blog post data from the external JSON file.
- All blog management (add, edit, delete) is performed client-side for demo purposes. Changes are not persisted to the JSON file automatically.
- The interface provides controls for searching, sorting, and filtering posts.
- A button is provided to open the Blog Admin app in a new tab.

## Credits

- Developed by Connor Moore.
- Uses [Bootstrap 5](https://getbootstrap.com/) for UI components.

---
