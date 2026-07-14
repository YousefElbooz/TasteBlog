# Blog Application API Documentation

## Base URL
`http://localhost:8000/api`

## Authentication

### Sign Up
`POST /signup`
- **Body (multipart/form-data)**: 
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, min:6, required)
  - `image` (file, optional)
- **Response**: `200 OK`
  - `{"access_token": "...", "token_type": "bearer", "user": {...}}`

### Log In
`POST /login`
- **Body (json)**:
  - `email` (string, required)
  - `password` (string, required)
- **Response**: `200 OK`
  - `{"access_token": "...", "token_type": "bearer", "user": {...}}`

### Log Out
`POST /logout` (Requires Bearer Token)
- **Response**: `200 OK`

### Get Current User
`GET /me` (Requires Bearer Token)
- **Response**: `200 OK`

## Posts

### List Posts
`GET /posts`
- **Response**: `200 OK` Array of posts with authors, tags, and comments.

### Get Single Post
`GET /posts/{id}`
- **Response**: `200 OK` Post object.

### Create Post
`POST /posts` (Requires Bearer Token)
- **Body**:
  - `title` (string, required)
  - `body` (string, required)
  - `tags` (array of strings, min 1 required)
- **Response**: `201 Created`

### Update Post
`PUT /posts/{id}` (Requires Bearer Token, must be author)
- **Body**:
  - `title` (string, optional)
  - `body` (string, optional)
  - `tags` (array of strings, optional)
- **Response**: `200 OK`

### Delete Post
`DELETE /posts/{id}` (Requires Bearer Token, must be author)
- **Response**: `200 OK`

## Comments

### Add Comment
`POST /posts/{id}/comments` (Requires Bearer Token)
- **Body**:
  - `body` (string, required)
- **Response**: `201 Created`

### Update Comment
`PUT /comments/{id}` (Requires Bearer Token, must be author)
- **Body**:
  - `body` (string, required)
- **Response**: `200 OK`

### Delete Comment
`DELETE /comments/{id}` (Requires Bearer Token, must be author)
- **Response**: `200 OK`
