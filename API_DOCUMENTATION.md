# CodeConnect Hub - Backend API Documentation

## 📌 Overview
This document describes all API endpoints needed for the CodeConnect Hub backend using **Node.js/Express + MongoDB**.

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### 1. **POST /auth/signup**
Register a new user
```
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "token": "jwt_token"
}
```

### 2. **POST /auth/login**
Login with email and password
```
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "token": "jwt_token"
}
```

### 3. **POST /auth/login/github**
OAuth login with GitHub
```
Request:
{
  "code": "github_oauth_code"
}

Response:
{
  "id": "user_id",
  "email": "user@github.com",
  "displayName": "GitHub User",
  "token": "jwt_token"
}
```

### 4. **POST /auth/login/google**
OAuth login with Google
```
Request:
{
  "code": "google_oauth_code"
}

Response:
{
  "id": "user_id",
  "email": "user@gmail.com",
  "displayName": "Google User",
  "token": "jwt_token"
}
```

### 5. **POST /auth/forgot-password**
Request password reset link
```
Request:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Reset link sent to email"
}
```

### 6. **POST /auth/reset-password**
Reset password with token
```
Request:
{
  "token": "reset_token",
  "newPassword": "newpassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

### 7. **POST /auth/update-password**
Update password (authenticated user)
```
Headers: Authorization: Bearer token
Request:
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}

Response:
{
  "message": "Password updated successfully"
}
```

---

## 👤 User Profile Endpoints

### 8. **GET /users/:userId**
Get user profile
```
Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "username": "johndoe",
  "avatar": "https://...",
  "cover": "https://...",
  "bio": "Developer",
  "skills": ["React", "Node.js"],
  "reputation": 150,
  "followers": 42,
  "following": 23,
  "postsCount": 10,
  "productsCount": 2,
  "joinedDate": "2024-01-01"
}
```

### 9. **GET /users/username/:username**
Get user profile by username
```
Response: (same as above)
```

### 10. **PUT /users/profile**
Update user profile (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "displayName": "John Doe",
  "username": "johndoe",
  "bio": "Full Stack Developer",
  "skills": ["React", "Node.js", "MongoDB"]
}

Response:
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

### 11. **POST /users/avatar**
Upload profile avatar (authenticated)
```
Headers: Authorization: Bearer token
Content-Type: multipart/form-data
Form Data:
{
  "file": [binary image file]
}

Response:
{
  "url": "https://...",
  "message": "Avatar uploaded"
}
```

### 12. **POST /users/cover**
Upload cover image (authenticated)
```
Headers: Authorization: Bearer token
Content-Type: multipart/form-data
Form Data:
{
  "file": [binary image file]
}

Response:
{
  "url": "https://...",
  "message": "Cover uploaded"
}
```

### 13. **POST /users/:userId/follow**
Follow a user (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "User followed",
  "isFollowing": true
}
```

### 14. **DELETE /users/:userId/follow**
Unfollow a user (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "User unfollowed",
  "isFollowing": false
}
```

### 15. **GET /users/:userId/is-following**
Check if current user follows another user (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "isFollowing": true
}
```

### 16. **GET /leaderboard**
Get leaderboard by reputation
```
Query: ?limit=50&offset=0
Response:
{
  "users": [
    {
      "id": "user_id",
      "displayName": "John",
      "reputation": 150,
      "rank": 1,
      "avatar": "https://..."
    }
  ]
}
```

---

## 📱 Social Feed Endpoints

### 17. **GET /posts**
Get social feed posts
```
Query: ?filter=trending&limit=20&offset=0&search=keyword
(filter: trending, latest, following)

Response:
{
  "posts": [
    {
      "id": "post_id",
      "content": "This is a post",
      "images": ["https://..."],
      "author": {
        "id": "user_id",
        "displayName": "John",
        "avatar": "https://..."
      },
      "likes": 10,
      "comments": 5,
      "shares": 2,
      "isLiked": false,
      "isBookmarked": false,
      "createdAt": "2024-01-15"
    }
  ],
  "total": 100
}
```

### 18. **GET /posts/:postId**
Get single post
```
Response:
{
  "id": "post_id",
  "content": "This is a post",
  "images": ["https://..."],
  "author": {...},
  "likes": 10,
  "comments": 5,
  "createdAt": "2024-01-15"
}
```

### 19. **GET /users/:userId/posts**
Get user's posts
```
Query: ?limit=20&offset=0
Response:
{
  "posts": [...],
  "total": 50
}
```

### 20. **POST /posts**
Create new post (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "content": "This is a post",
  "images": ["https://..."]
}

Response:
{
  "id": "post_id",
  "content": "This is a post",
  "images": ["https://..."],
  "author": {...},
  "createdAt": "2024-01-15"
}
```

### 21. **DELETE /posts/:postId**
Delete post (authenticated, author only)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Post deleted"
}
```

### 22. **POST /posts/:postId/upload-image**
Upload image for post (authenticated)
```
Headers: Authorization: Bearer token
Content-Type: multipart/form-data
Response:
{
  "url": "https://..."
}
```

### 23. **POST /posts/:postId/like**
Like a post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "liked": true,
  "likesCount": 11
}
```

### 24. **DELETE /posts/:postId/like**
Unlike a post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "liked": false,
  "likesCount": 10
}
```

### 25. **GET /posts/:postId/is-liked**
Check if current user liked post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "isLiked": true
}
```

### 26. **POST /posts/:postId/bookmark**
Bookmark a post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "bookmarked": true
}
```

### 27. **DELETE /posts/:postId/bookmark**
Unbookmark a post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "bookmarked": false
}
```

### 28. **GET /posts/:postId/is-bookmarked**
Check if current user bookmarked post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "isBookmarked": true
}
```

---

## 💬 Post Comments Endpoints

### 29. **GET /posts/:postId/comments**
Get post comments
```
Query: ?limit=20&offset=0
Response:
{
  "comments": [
    {
      "id": "comment_id",
      "content": "Great post!",
      "author": {...},
      "likes": 2,
      "createdAt": "2024-01-15"
    }
  ],
  "total": 25
}
```

### 30. **POST /posts/:postId/comments**
Create comment (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "content": "Great post!",
  "images": ["https://..."]
}

Response:
{
  "id": "comment_id",
  "content": "Great post!",
  "author": {...},
  "createdAt": "2024-01-15"
}
```

### 31. **DELETE /posts/:postId/comments/:commentId**
Delete comment (authenticated, author only)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Comment deleted"
}
```

### 32. **POST /posts/:postId/comments/:commentId/like**
Like comment (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "liked": true,
  "likesCount": 3
}
```

### 33. **DELETE /posts/:postId/comments/:commentId/like**
Unlike comment (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "liked": false,
  "likesCount": 2
}
```

### 34. **GET /posts/:postId/comments/:commentId/is-liked**
Check if comment is liked (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "isLiked": true
}
```

---

## 📝 Blog/Articles Endpoints

### 35. **GET /blog/posts**
Get published blog posts
```
Query: ?category=tech&sortBy=latest&limit=20&offset=0&search=keyword
(sortBy: latest, trending, mostLiked)

Response:
{
  "posts": [
    {
      "id": "blog_id",
      "title": "How to Build APIs",
      "slug": "how-to-build-apis",
      "content": "...",
      "excerpt": "...",
      "author": {...},
      "category": "tech",
      "tags": ["api", "nodejs"],
      "status": "published",
      "image": "https://...",
      "readTime": 5,
      "views": 150,
      "likes": 42,
      "commentsCount": 8,
      "isLiked": false,
      "isBookmarked": false,
      "createdAt": "2024-01-15"
    }
  ],
  "total": 100
}
```

### 36. **GET /blog/posts/:idOrSlug**
Get single blog post
```
Response:
{
  "id": "blog_id",
  "title": "How to Build APIs",
  "slug": "how-to-build-apis",
  "content": "...",
  "author": {...},
  "category": "tech",
  "tags": ["api", "nodejs"],
  "image": "https://...",
  "readTime": 5,
  "views": 151,
  "likes": 42,
  "createdAt": "2024-01-15"
}
```

### 37. **GET /blog/admin/posts**
Get all blog posts for moderation (authenticated, admin only)
```
Headers: Authorization: Bearer token
Query: ?status=draft&limit=20&offset=0
(status: draft, pending, approved, rejected)

Response:
{
  "posts": [...],
  "total": 50
}
```

### 38. **GET /users/:userId/blog/posts**
Get user's blog posts
```
Query: ?limit=20&offset=0
Response:
{
  "posts": [...],
  "total": 15
}
```

### 39. **POST /blog/posts**
Create new blog post (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "How to Build APIs",
  "content": "...",
  "excerpt": "...",
  "category": "tech",
  "tags": ["api", "nodejs"],
  "image": "https://..."
}

Response:
{
  "id": "blog_id",
  "title": "How to Build APIs",
  "slug": "how-to-build-apis",
  "status": "draft",
  "createdAt": "2024-01-15"
}
```

### 40. **PUT /blog/posts/:postId**
Update blog post (authenticated, author only)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "Updated Title",
  "content": "...",
  "excerpt": "...",
  "category": "tech",
  "tags": ["api", "nodejs"],
  "image": "https://..."
}

Response:
{
  "message": "Blog post updated",
  "post": {...}
}
```

### 41. **DELETE /blog/posts/:postId**
Delete blog post (authenticated, author only)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Blog post deleted"
}
```

### 42. **POST /blog/admin/posts/:postId/approve**
Approve blog post (authenticated, admin only)
```
Headers: Authorization: Bearer token
Request:
{
  "approved": true
}

Response:
{
  "message": "Blog post approved",
  "post": {...}
}
```

### 43. **GET /blog/posts/:postId/like**
Like blog post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "liked": true,
  "likesCount": 43
}
```

### 44. **DELETE /blog/posts/:postId/like**
Unlike blog post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "liked": false,
  "likesCount": 42
}
```

### 45. **GET /blog/posts/:postId/is-liked**
Check if blog post is liked (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "isLiked": true
}
```

### 46. **POST /blog/posts/:postId/bookmark**
Bookmark blog post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "bookmarked": true
}
```

### 47. **DELETE /blog/posts/:postId/bookmark**
Unbookmark blog post (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "bookmarked": false
}
```

### 48. **GET /blog/posts/:postId/is-bookmarked**
Check if blog post is bookmarked (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "isBookmarked": true
}
```

### 49. **POST /blog/posts/:postId/view**
Increment blog post view count
```
Response:
{
  "views": 152
}
```

---

## 📚 Blog Series Endpoints

### 50. **GET /blog/series**
Get all blog series
```
Query: ?limit=20&offset=0&search=keyword
Response:
{
  "series": [
    {
      "id": "series_id",
      "title": "React Tutorial Series",
      "slug": "react-tutorial-series",
      "description": "...",
      "image": "https://...",
      "author": {...},
      "postsCount": 10,
      "views": 500,
      "createdAt": "2024-01-01"
    }
  ],
  "total": 25
}
```

### 51. **GET /blog/series/:idOrSlug**
Get series with all posts
```
Response:
{
  "id": "series_id",
  "title": "React Tutorial Series",
  "slug": "react-tutorial-series",
  "description": "...",
  "image": "https://...",
  "author": {...},
  "posts": [
    {
      "id": "blog_id",
      "title": "Getting Started",
      "slug": "getting-started",
      "order": 1,
      "content": "..."
    }
  ],
  "createdAt": "2024-01-01"
}
```

### 52. **GET /blog/admin/series**
Get all series for moderation (authenticated, admin only)
```
Headers: Authorization: Bearer token
Response:
{
  "series": [...],
  "total": 30
}
```

### 53. **GET /users/:userId/blog/series**
Get user's blog series
```
Response:
{
  "series": [...],
  "total": 5
}
```

### 54. **POST /blog/series**
Create new series (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "React Tutorial Series",
  "description": "...",
  "image": "https://..."
}

Response:
{
  "id": "series_id",
  "title": "React Tutorial Series",
  "slug": "react-tutorial-series",
  "createdAt": "2024-01-01"
}
```

### 55. **PUT /blog/series/:seriesId**
Update series (authenticated, author only)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "Updated Title",
  "description": "...",
  "image": "https://..."
}

Response:
{
  "message": "Series updated",
  "series": {...}
}
```

### 56. **DELETE /blog/series/:seriesId**
Delete series (authenticated, author only)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Series deleted"
}
```

### 57. **POST /blog/admin/series/:seriesId/approve**
Approve series (authenticated, admin only)
```
Headers: Authorization: Bearer token
Request:
{
  "approved": true
}

Response:
{
  "message": "Series approved"
}
```

---

## 🛒 Marketplace Endpoints

### 58. **GET /products**
Get published products
```
Query: ?category=templates&limit=20&offset=0&sort=latest&search=keyword
(category: templates, code, tools, courses)
(sort: latest, trending, mostSold)

Response:
{
  "products": [
    {
      "id": "product_id",
      "title": "React Admin Template",
      "slug": "react-admin-template",
      "description": "...",
      "image": "https://...",
      "price": 29.99,
      "currency": "USD",
      "category": "templates",
      "tags": ["react", "admin"],
      "author": {...},
      "rating": 4.5,
      "reviewsCount": 25,
      "sales": 100,
      "isPurchased": false,
      "status": "published",
      "createdAt": "2024-01-01"
    }
  ],
  "total": 150
}
```

### 59. **GET /products/featured**
Get featured products
```
Response:
{
  "products": [...],
  "total": 10
}
```

### 60. **GET /products/:productId**
Get single product
```
Response:
{
  "id": "product_id",
  "title": "React Admin Template",
  "slug": "react-admin-template",
  "description": "...",
  "image": "https://...",
  "price": 29.99,
  "category": "templates",
  "tags": ["react", "admin"],
  "author": {...},
  "rating": 4.5,
  "reviewsCount": 25,
  "sales": 100,
  "isPurchased": false,
  "downloads": "...",
  "preview": "https://...",
  "createdAt": "2024-01-01"
}
```

### 61. **GET /users/:userId/products**
Get user's products
```
Response:
{
  "products": [...],
  "total": 5
}
```

### 62. **GET /users/:userId/purchases**
Get user's purchases (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "purchases": [
    {
      "id": "purchase_id",
      "product": {...},
      "purchaseDate": "2024-01-15",
      "downloadUrl": "https://...",
      "expiresAt": "2025-01-15"
    }
  ],
  "total": 10
}
```

### 63. **GET /products/:productId/has-purchased**
Check if user purchased product (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "hasPurchased": true,
  "downloadUrl": "https://..."
}
```

### 64. **POST /products/:productId/purchase**
Purchase product (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "paymentMethodId": "pm_..."
}

Response:
{
  "message": "Product purchased",
  "purchaseId": "purchase_id",
  "downloadUrl": "https://..."
}
```

### 65. **POST /products**
Create product (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "React Admin Template",
  "description": "...",
  "image": "https://...",
  "price": 29.99,
  "currency": "USD",
  "category": "templates",
  "tags": ["react", "admin"],
  "downloadUrl": "https://...",
  "preview": "https://"
}

Response:
{
  "id": "product_id",
  "title": "React Admin Template",
  "status": "draft",
  "createdAt": "2024-01-15"
}
```

### 66. **PUT /products/:productId**
Update product (authenticated, author only)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "Updated Title",
  "description": "...",
  "price": 39.99,
  "image": "https://..."
}

Response:
{
  "message": "Product updated",
  "product": {...}
}
```

### 67. **DELETE /products/:productId**
Delete product (authenticated, author only)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Product deleted"
}
```

### 68. **GET /products/admin/all**
Get all products for moderation (authenticated, admin only)
```
Headers: Authorization: Bearer token
Response:
{
  "products": [...],
  "total": 300
}
```

---

## ⭐ Product Reviews Endpoints

### 69. **GET /products/:productId/reviews**
Get product reviews
```
Query: ?limit=20&offset=0
Response:
{
  "reviews": [
    {
      "id": "review_id",
      "author": {...},
      "rating": 5,
      "content": "Great product!",
      "helpful": 10,
      "createdAt": "2024-01-15"
    }
  ],
  "average": 4.5,
  "total": 25
}
```

### 70. **POST /products/:productId/reviews**
Create product review (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "rating": 5,
  "content": "Great product!"
}

Response:
{
  "id": "review_id",
  "rating": 5,
  "content": "Great product!",
  "author": {...},
  "createdAt": "2024-01-15"
}
```

---

## 🎫 Support Tickets Endpoints

### 71. **GET /tickets**
Get user's support tickets (authenticated)
```
Headers: Authorization: Bearer token
Query: ?status=open&limit=20&offset=0
(status: open, closed, resolved)

Response:
{
  "tickets": [
    {
      "id": "ticket_id",
      "subject": "Cannot download product",
      "description": "...",
      "product": {...},
      "status": "open",
      "priority": "high",
      "createdAt": "2024-01-15",
      "updatedAt": "2024-01-16",
      "messagesCount": 3
    }
  ],
  "total": 5
}
```

### 72. **GET /tickets/:ticketId**
Get single ticket (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "id": "ticket_id",
  "subject": "Cannot download product",
  "description": "...",
  "product": {...},
  "status": "open",
  "priority": "high",
  "createdAt": "2024-01-15"
}
```

### 73. **GET /tickets/:ticketId/messages**
Get ticket messages (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "messages": [
    {
      "id": "message_id",
      "author": {...},
      "content": "Thanks for contacting us",
      "isAdmin": true,
      "createdAt": "2024-01-16"
    }
  ],
  "total": 3
}
```

### 74. **POST /tickets**
Create support ticket (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "subject": "Cannot download product",
  "description": "...",
  "productId": "product_id",
  "priority": "high"
}

Response:
{
  "id": "ticket_id",
  "subject": "Cannot download product",
  "status": "open",
  "createdAt": "2024-01-15"
}
```

### 75. **POST /tickets/:ticketId/messages**
Add message to ticket (authenticated)
```
Headers: Authorization: Bearer token
Request:
{
  "content": "I still cannot download"
}

Response:
{
  "id": "message_id",
  "content": "I still cannot download",
  "author": {...},
  "createdAt": "2024-01-16"
}
```

### 76. **GET /tickets/admin/all**
Get all tickets (authenticated, admin only)
```
Headers: Authorization: Bearer token
Response:
{
  "tickets": [...],
  "total": 100
}
```

### 77. **PUT /tickets/:ticketId/status**
Update ticket status (authenticated, admin only)
```
Headers: Authorization: Bearer token
Request:
{
  "status": "resolved"
}

Response:
{
  "message": "Ticket status updated",
  "ticket": {...}
}
```

---

## 📚 Learning Resources Endpoints

### 78. **GET /resources**
Get learning resources
```
Query: ?filter=all&limit=20&offset=0&search=keyword
(filter: free, premium, all)

Response:
{
  "resources": [
    {
      "id": "resource_id",
      "title": "React Cheatsheet PDF",
      "type": "pdf",
      "description": "...",
      "file": "https://...",
      "isPremium": false,
      "author": {...},
      "downloads": 250,
      "rating": 4.8,
      "createdAt": "2024-01-01"
    }
  ],
  "total": 80
}
```

### 79. **GET /resources/:resourceId**
Get single resource
```
Response:
{
  "id": "resource_id",
  "title": "React Cheatsheet PDF",
  "type": "pdf",
  "description": "...",
  "file": "https://...",
  "isPremium": false,
  "author": {...},
  "downloads": 251,
  "rating": 4.8
}
```

### 80. **GET /resources/admin/all**
Get all resources (authenticated, admin only)
```
Headers: Authorization: Bearer token
Response:
{
  "resources": [...],
  "total": 120
}
```

### 81. **GET /users/:userId/resources/purchases**
Get user's resource purchases (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "purchases": [
    {
      "id": "purchase_id",
      "resource": {...},
      "purchaseDate": "2024-01-15",
      "fileUrl": "https://..."
    }
  ],
  "total": 15
}
```

### 82. **POST /resources/:resourceId/unlock**
Purchase/unlock premium resource (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Resource unlocked",
  "fileUrl": "https://..."
}
```

### 83. **POST /resources**
Upload resource (authenticated, admin)
```
Headers: Authorization: Bearer token
Content-Type: multipart/form-data
Request:
{
  "title": "React Cheatsheet",
  "type": "pdf",
  "description": "...",
  "isPremium": false,
  "file": [binary file]
}

Response:
{
  "id": "resource_id",
  "title": "React Cheatsheet",
  "file": "https://...",
  "createdAt": "2024-01-15"
}
```

### 84. **PUT /resources/:resourceId**
Update resource (authenticated, admin)
```
Headers: Authorization: Bearer token
Request:
{
  "title": "Updated Title",
  "description": "...",
  "isPremium": true
}

Response:
{
  "message": "Resource updated",
  "resource": {...}
}
```

### 85. **DELETE /resources/:resourceId**
Delete resource (authenticated, admin)
```
Headers: Authorization: Bearer token
Response:
{
  "message": "Resource deleted"
}
```

---

## 🏆 Gamification/Badges Endpoints

### 86. **GET /users/:userId/badges**
Get user's badges
```
Response:
{
  "badges": [
    {
      "id": "badge_id",
      "name": "First Post",
      "icon": "https://...",
      "description": "Create your first post",
      "awarded": "2024-01-15"
    }
  ],
  "total": 5
}
```

---

## 📊 Statistics Endpoints

### 87. **GET /stats/user**
Get user statistics (authenticated)
```
Headers: Authorization: Bearer token
Response:
{
  "postsCount": 15,
  "blogPostsCount": 5,
  "productsCount": 2,
  "purchasesCount": 8,
  "followers": 42,
  "following": 23,
  "reputation": 350,
  "totalViews": 1500,
  "totalLikes": 200
}
```

---

## 🔍 Search Endpoint

### 88. **GET /search**
Global search
```
Query: ?q=keyword&type=all&limit=10
(type: posts, blogs, products, users, all)

Response:
{
  "posts": [...],
  "blogs": [...],
  "products": [...],
  "users": [...],
  "total": 50
}
```

---

## Database Schema (MongoDB)

### Collections Structure:

```javascript
// users collection
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  displayName: String,
  username: String (unique),
  avatar: String (URL),
  cover: String (URL),
  bio: String,
  skills: [String],
  reputation: Number (default: 0),
  followers: [ObjectId], // array of user IDs
  following: [ObjectId],
  joinedDate: Date,
  role: String (user, admin),
  isBanned: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// posts collection
{
  _id: ObjectId,
  content: String,
  images: [String] (URLs),
  author: ObjectId (ref: users),
  likes: [ObjectId], // array of user IDs
  comments: [ObjectId] (ref: comments),
  bookmarks: [ObjectId], // array of user IDs
  shares: Number,
  createdAt: Date,
  updatedAt: Date
}

// blog_posts collection
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  content: String,
  excerpt: String,
  images: String (URL),
  author: ObjectId (ref: users),
  category: String,
  tags: [String],
  status: String (draft, pending, approved, rejected),
  readTime: Number,
  views: Number,
  likes: [ObjectId],
  bookmarks: [ObjectId],
  comments: [ObjectId] (ref: comments),
  series: ObjectId (ref: series) - optional,
  createdAt: Date,
  updatedAt: Date
}

// blog_series collection
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  description: String,
  image: String (URL),
  author: ObjectId (ref: users),
  posts: [ObjectId] (ref: blog_posts) - ordered,
  status: String (draft, pending, approved),
  createdAt: Date,
  updatedAt: Date
}

// products collection
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  description: String,
  image: String (URL),
  price: Number,
  currency: String (USD, EUR, VND),
  category: String (templates, code, tools, courses),
  tags: [String],
  author: ObjectId (ref: users),
  downloadUrl: String,
  preview: String (URL),
  status: String (draft, pending, approved),
  sales: Number,
  rating: Number,
  reviews: [ObjectId] (ref: reviews),
  createdAt: Date,
  updatedAt: Date
}

// purchases collection
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  product: ObjectId (ref: products),
  amount: Number,
  currency: String,
  paymentId: String (Stripe/payment gateway),
  status: String (completed, failed, refunded),
  purchaseDate: Date,
  expiresAt: Date,
  downloadUrl: String,
  createdAt: Date
}

// reviews collection
{
  _id: ObjectId,
  author: ObjectId (ref: users),
  product: ObjectId (ref: products),
  rating: Number (1-5),
  content: String,
  helpful: Number,
  createdAt: Date
}

// tickets collection
{
  _id: ObjectId,
  subject: String,
  description: String,
  user: ObjectId (ref: users),
  product: ObjectId (ref: products) - optional,
  status: String (open, resolved, closed),
  priority: String (low, medium, high),
  messages: [ObjectId] (ref: ticket_messages),
  createdAt: Date,
  updatedAt: Date
}

// ticket_messages collection
{
  _id: ObjectId,
  ticket: ObjectId (ref: tickets),
  author: ObjectId (ref: users),
  content: String,
  isAdmin: Boolean,
  createdAt: Date
}

// resources collection
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  description: String,
  type: String (pdf, code, image, video),
  fileUrl: String,
  isPremium: Boolean,
  author: ObjectId (ref: users),
  downloads: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}

// badges collection
{
  _id: ObjectId,
  name: String,
  icon: String (URL),
  description: String,
  createdAt: Date
}

// user_badges collection
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  badge: ObjectId (ref: badges),
  awardedAt: Date
}

// follows collection (for follow relationships)
{
  _id: ObjectId,
  follower: ObjectId (ref: users),
  following: ObjectId (ref: users),
  createdAt: Date
}

// bookmarks collection (for saved posts/blogs/products)
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  type: String (post, blog, product),
  targetId: ObjectId,
  createdAt: Date
}

// comments collection
{
  _id: ObjectId,
  author: ObjectId (ref: users),
  targetType: String (post, blog),
  targetId: ObjectId,
  content: String,
  images: [String],
  likes: [ObjectId],
  createdAt: Date
}
```

---

## Authentication

All endpoints marked with *(authenticated)* require:
- Header: `Authorization: Bearer <jwt_token>`

The JWT token should be obtained from `/auth/login` or `/auth/signup` endpoint and stored in localStorage/cookies on the frontend.

---

## Response Format

All responses follow this format:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional message"
}
```

For errors:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Pagination

For endpoints with `?limit=20&offset=0`:
- `limit`: Number of items per page
- `offset`: Starting index (0-based)

Response should include:
```json
{
  "items": [...],
  "total": 100,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

---

## File Upload

For file uploads, use multipart/form-data and ensure the file size is limited (e.g., 10MB for images, 50MB for product downloads).

---

## Rate Limiting

Implement rate limiting:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

---

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email, username, etc.)
- `429` - Too Many Requests
- `500` - Server Error

---

## Notes for Backend Implementation

1. **JWT Token**: Use HS256 or RS256 algorithm with expiration of 24-48 hours
2. **Password Hashing**: Use bcrypt with salt rounds 10+
3. **Email Verification**: Implement verification links for new registrations
4. **CORS**: Enable CORS for frontend domain
5. **Validation**: Implement input validation for all endpoints
6. **Sanitization**: Sanitize user inputs to prevent injection attacks
7. **Pagination**: Always implement pagination for list endpoints
8. **Caching**: Consider Redis caching for frequently accessed data
9. **File Storage**: Use AWS S3, Google Cloud Storage, or similar for file uploads
10. **Database Indexing**: Create indexes on commonly queried fields (email, username, slug, createdAt)

---

Generated: 2026-01-29
