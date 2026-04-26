# CodeConnect Hub - API Quick Reference

## 🔗 API Modules & Endpoints Overview

### Authentication Module (7 endpoints)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | Login with email/password | ❌ |
| POST | `/auth/login/github` | OAuth login via GitHub | ❌ |
| POST | `/auth/login/google` | OAuth login via Google | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password with token | ❌ |
| POST | `/auth/update-password` | Change password (authenticated) | ✅ |

---

### User Module (9 endpoints)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/users/:userId` | Get user profile | ❌ |
| GET | `/users/username/:username` | Get profile by username | ❌ |
| PUT | `/users/profile` | Update user profile | ✅ |
| POST | `/users/avatar` | Upload avatar | ✅ |
| POST | `/users/cover` | Upload cover image | ✅ |
| POST | `/users/:userId/follow` | Follow user | ✅ |
| DELETE | `/users/:userId/follow` | Unfollow user | ✅ |
| GET | `/users/:userId/is-following` | Check follow status | ✅ |
| GET | `/leaderboard` | Get reputation leaderboard | ❌ |

---

### Posts Module - Social Feed (17 endpoints)

#### Posts Management
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/posts` | Get feed posts (trending/latest/following) | ✅ |
| GET | `/posts/:postId` | Get single post | ❌ |
| GET | `/users/:userId/posts` | Get user's posts | ❌ |
| POST | `/posts` | Create new post | ✅ |
| DELETE | `/posts/:postId` | Delete post | ✅ |
| POST | `/posts/:postId/upload-image` | Upload post image | ✅ |

#### Post Interactions
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/posts/:postId/like` | Like post | ✅ |
| DELETE | `/posts/:postId/like` | Unlike post | ✅ |
| GET | `/posts/:postId/is-liked` | Check if liked | ✅ |
| POST | `/posts/:postId/bookmark` | Bookmark post | ✅ |
| DELETE | `/posts/:postId/bookmark` | Remove bookmark | ✅ |
| GET | `/posts/:postId/is-bookmarked` | Check if bookmarked | ✅ |

#### Post Comments
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/posts/:postId/comments` | Get post comments | ❌ |
| POST | `/posts/:postId/comments` | Create comment | ✅ |
| DELETE | `/posts/:postId/comments/:commentId` | Delete comment | ✅ |
| POST | `/posts/:postId/comments/:commentId/like` | Like comment | ✅ |
| DELETE | `/posts/:postId/comments/:commentId/like` | Unlike comment | ✅ |
| GET | `/posts/:postId/comments/:commentId/is-liked` | Check comment like | ✅ |

---

### Blog Module (22 endpoints)

#### Blog Posts
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/blog/posts` | Get published blog posts | ❌ |
| GET | `/blog/posts/:idOrSlug` | Get single blog post | ❌ |
| GET | `/blog/admin/posts` | Get all posts (admin moderation) | ✅ |
| GET | `/users/:userId/blog/posts` | Get user's blog posts | ❌ |
| POST | `/blog/posts` | Create blog post | ✅ |
| PUT | `/blog/posts/:postId` | Update blog post | ✅ |
| DELETE | `/blog/posts/:postId` | Delete blog post | ✅ |
| POST | `/blog/admin/posts/:postId/approve` | Approve/reject post (admin) | ✅ |

#### Blog Post Interactions
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/blog/posts/:postId/like` | Like blog post | ✅ |
| DELETE | `/blog/posts/:postId/like` | Unlike blog post | ✅ |
| GET | `/blog/posts/:postId/is-liked` | Check if liked | ✅ |
| POST | `/blog/posts/:postId/bookmark` | Bookmark blog post | ✅ |
| DELETE | `/blog/posts/:postId/bookmark` | Remove bookmark | ✅ |
| GET | `/blog/posts/:postId/is-bookmarked` | Check if bookmarked | ✅ |
| POST | `/blog/posts/:postId/view` | Increment view count | ❌ |

#### Blog Comments
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/blog/posts/:postId/comments` | Get blog comments | ❌ |
| POST | `/blog/posts/:postId/comments` | Create comment | ✅ |
| DELETE | `/blog/posts/:postId/comments/:commentId` | Delete comment | ✅ |
| POST | `/blog/posts/:postId/comments/:commentId/like` | Like comment | ✅ |
| DELETE | `/blog/posts/:postId/comments/:commentId/like` | Unlike comment | ✅ |

#### Blog Series
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/blog/series` | Get all series | ❌ |
| GET | `/blog/series/:idOrSlug` | Get series with posts | ❌ |
| GET | `/blog/admin/series` | Get all series (admin) | ✅ |
| GET | `/users/:userId/blog/series` | Get user's series | ❌ |
| POST | `/blog/series` | Create series | ✅ |
| PUT | `/blog/series/:seriesId` | Update series | ✅ |
| DELETE | `/blog/series/:seriesId` | Delete series | ✅ |
| POST | `/blog/admin/series/:seriesId/approve` | Approve series (admin) | ✅ |

---

### Marketplace Module (13 endpoints)

#### Products
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/products` | Get published products | ❌ |
| GET | `/products/featured` | Get featured products | ❌ |
| GET | `/products/:productId` | Get single product | ❌ |
| GET | `/users/:userId/products` | Get user's products | ❌ |
| POST | `/products` | Create product | ✅ |
| PUT | `/products/:productId` | Update product | ✅ |
| DELETE | `/products/:productId` | Delete product | ✅ |
| GET | `/products/admin/all` | Get all products (admin) | ✅ |

#### Purchases
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/users/:userId/purchases` | Get user's purchases | ✅ |
| GET | `/products/:productId/has-purchased` | Check if purchased | ✅ |
| POST | `/products/:productId/purchase` | Purchase product | ✅ |

#### Reviews
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/products/:productId/reviews` | Get product reviews | ❌ |
| POST | `/products/:productId/reviews` | Create review | ✅ |

---

### Support Tickets Module (7 endpoints)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/tickets` | Get user's tickets | ✅ |
| GET | `/tickets/:ticketId` | Get single ticket | ✅ |
| GET | `/tickets/:ticketId/messages` | Get ticket messages | ✅ |
| POST | `/tickets` | Create ticket | ✅ |
| POST | `/tickets/:ticketId/messages` | Add message to ticket | ✅ |
| GET | `/tickets/admin/all` | Get all tickets (admin) | ✅ |
| PUT | `/tickets/:ticketId/status` | Update ticket status (admin) | ✅ |

---

### Learning Resources Module (8 endpoints)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/resources` | Get resources (free/premium) | ❌ |
| GET | `/resources/:resourceId` | Get single resource | ❌ |
| GET | `/resources/admin/all` | Get all resources (admin) | ✅ |
| GET | `/users/:userId/resources/purchases` | Get resource purchases | ✅ |
| POST | `/resources/:resourceId/unlock` | Purchase/unlock resource | ✅ |
| POST | `/resources` | Upload resource | ✅ |
| PUT | `/resources/:resourceId` | Update resource | ✅ |
| DELETE | `/resources/:resourceId` | Delete resource | ✅ |

---

### Gamification Module (2 endpoints)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/users/:userId/badges` | Get user's badges | ❌ |
| - | - | Badges awarded automatically | - |

---

### Statistics Module (1 endpoint)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/stats/user` | Get user statistics | ✅ |

---

### Search Module (1 endpoint)
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/search` | Global search (posts, blogs, products, users) | ❌ |

---

## 📊 Data Models & Relationships

### User
```
User
├── Followers (User[])
├── Following (User[])
├── Posts (Post[])
├── BlogPosts (BlogPost[])
├── Products (Product[])
├── Purchases (Purchase[])
├── Tickets (Ticket[])
└── Badges (Badge[])
```

### Content Moderation Flow
```
User creates BlogPost → status: "draft"
                    ↓
Admin reviews → approve/reject
                    ↓
If approved → status: "approved" (visible to public)
If rejected → status: "rejected" (only visible to author)
```

### Purchase Flow
```
User → Purchase Product → Payment Processing → Purchase Record Created
                                            ↓
                                      Generate Download Link
                                      Send Confirmation Email
```

### Support Ticket Flow
```
User creates Ticket
      ↓
Admin/Support assigns ticket
      ↓
Back-and-forth messaging
      ↓
Admin marks as resolved/closed
```

---

## 🔄 Common Workflows

### 1. User Registration & Profile Setup
```
POST /auth/signup → User created
    ↓
GET /users/:userId → Fetch profile
    ↓
POST /users/avatar → Upload avatar
    ↓
PUT /users/profile → Update bio, skills
```

### 2. Creating & Publishing Blog Post
```
POST /blog/posts (status: draft)
    ↓
PUT /blog/posts/:id (edit content)
    ↓
POST /blog/admin/posts/:id/approve (admin approves)
    ↓
GET /blog/posts/:id (published, visible)
```

### 3. Creating Product & Selling
```
POST /products (status: draft)
    ↓
POST /products/upload-image
    ↓
PUT /products/:id (set price, etc)
    ↓
POST /blog/admin/products/:id/approve (admin approves)
    ↓
GET /products/:id (publicly visible)
    ↓
User: POST /products/:id/purchase
    ↓
Backend: Create Purchase, generate download_url
```

### 4. Social Interaction
```
POST /posts (create post)
    ↓
GET /posts (get feed)
    ↓
POST /posts/:id/like (like post)
    ↓
POST /posts/:id/comments (add comment)
    ↓
POST /posts/:id/comments/:cid/like (like comment)
```

---

## 🚀 Implementation Priority

### Must Have (MVP)
- ✅ Authentication (signup, login)
- ✅ User profiles
- ✅ Social posts
- ✅ Blog posts
- ✅ Products marketplace
- ✅ Basic comments

### Should Have
- ✅ Search functionality
- ✅ Leaderboard
- ✅ Support tickets
- ✅ Reviews system

### Nice to Have
- ⭕ OAuth (GitHub, Google)
- ⭕ Learning resources
- ⭕ Gamification (badges)
- ⭕ Advanced caching
- ⭕ Real-time notifications

---

## 💡 Frontend Integration Tips

### 1. Environment Setup
```javascript
// .env file
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FRONTEND_URL=http://localhost:8080
```

### 2. API Call Example
```javascript
import { api } from '@/lib/api';

// Login
const response = await api.auth.login(email, password);
if (response.success) {
  const user = response.data;
  console.log('Logged in as:', user.displayName);
}

// Create post
const postResponse = await api.post.createPost('Hello world!', []);
if (postResponse.success) {
  console.log('Post created:', postResponse.data.id);
}
```

### 3. Error Handling
```javascript
const response = await api.post.getPosts();
if (!response.success) {
  console.error('API Error:', response.error);
  toast.error(response.error);
}
```

---

## 📝 Total Statistics

| Category | Count |
|----------|-------|
| Total Endpoints | 88 |
| Authenticated Endpoints | 56 |
| Public Endpoints | 32 |
| Main Modules | 10 |
| Collections (MongoDB) | 13 |
| User Roles | 2 (user, admin) |

---

Generated: 2026-01-29
Version: 1.0
