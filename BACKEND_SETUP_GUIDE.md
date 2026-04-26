# CodeConnect Hub - Backend Implementation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Environment Setup](#environment-setup)
5. [API Endpoints Implementation](#api-endpoints-implementation)
6. [Authentication](#authentication)
7. [File Uploads](#file-uploads)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

**CodeConnect Hub** is a comprehensive developer community platform with:
- **Social Features**: Posts, comments, likes, bookmarks
- **Blog Platform**: Articles, series, nested categories
- **Marketplace**: Digital products (templates, tools, courses)
- **Learning Resources**: PDFs, code samples, videos
- **Support System**: Customer support tickets with messaging
- **Gamification**: Badges, reputation, leaderboards
- **User Management**: Profiles, follows, roles

Total API Endpoints: **88 endpoints** across 7 main modules

---

## 🛠 Tech Stack

### Recommended Stack
```
Runtime: Node.js (v18+)
Framework: Express.js v4
Database: MongoDB v6+
ORM/Query: Mongoose v7+ or MongoDB Native Driver
Authentication: JWT (jsonwebtoken)
Password Hashing: bcryptjs
File Upload: multer (AWS S3/Google Cloud Storage integration)
Email: Nodemailer or SendGrid
Environment: dotenv
Validation: joi or zod
CORS: cors package
Rate Limiting: express-rate-limit
Logging: winston or morgan
```

### Installation
```bash
npm init -y
npm install express mongoose jsonwebtoken bcryptjs multer cors dotenv joi
npm install --save-dev nodemon
```

---

## 📊 Database Schema

### MongoDB Collections

#### 1. **users**
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase, required),
  password: String (hashed, required),
  displayName: String (required),
  username: String (unique, lowercase),
  avatar: String (URL),
  cover: String (URL),
  bio: String (max 500),
  skills: [String],
  reputation: Number (default: 0),
  followers: [ObjectId], // ref: User._id
  following: [ObjectId], // ref: User._id
  role: String (enum: ['user', 'admin'], default: 'user'),
  email_verified: Boolean (default: false),
  isBanned: Boolean (default: false),
  banned_reason: String,
  banned_until: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date (auto)
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ reputation: -1 })
db.users.createIndex({ createdAt: -1 })
```

#### 2. **posts** (Social Feed)
```javascript
{
  _id: ObjectId,
  content: String (required, max 5000),
  images: [String] (URLs, max 10),
  author: ObjectId (ref: User._id, required),
  likes: [ObjectId], // User._id array
  likesCount: Number,
  comments: [ObjectId], // ref: Comment._id
  commentsCount: Number,
  bookmarks: [ObjectId], // User._id array
  bookmarksCount: Number,
  shares: Number,
  visibility: String (enum: ['public', 'private'], default: 'public'),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.posts.createIndex({ author: 1 })
db.posts.createIndex({ createdAt: -1 })
db.posts.createIndex({ likesCount: -1 })
```

#### 3. **comments**
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User._id, required),
  postType: String (enum: ['post', 'blog', 'product']),
  postId: ObjectId (required),
  content: String (required, max 1000),
  images: [String] (URLs, max 3),
  likes: [ObjectId],
  likesCount: Number,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.comments.createIndex({ postId: 1 })
db.comments.createIndex({ author: 1 })
```

#### 4. **blog_posts**
```javascript
{
  _id: ObjectId,
  title: String (required, unique),
  slug: String (required, unique),
  content: String (required),
  excerpt: String (required, max 300),
  image: String (URL),
  author: ObjectId (ref: User._id, required),
  category: String (required),
  tags: [String],
  status: String (enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft'),
  readTime: Number, // calculated
  views: Number (default: 0),
  likes: [ObjectId],
  likesCount: Number,
  bookmarks: [ObjectId],
  bookmarksCount: Number,
  comments: [ObjectId], // ref: Comment._id
  commentsCount: Number,
  series: ObjectId (ref: BlogSeries._id), // optional
  isApprovedAt: Date, // when admin approved
  approvedBy: ObjectId, // admin who approved
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.blog_posts.createIndex({ slug: 1 }, { unique: true })
db.blog_posts.createIndex({ author: 1 })
db.blog_posts.createIndex({ status: 1 })
db.blog_posts.createIndex({ category: 1 })
db.blog_posts.createIndex({ createdAt: -1 })
db.blog_posts.createIndex({ views: -1 })
```

#### 5. **blog_series**
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique),
  description: String (required),
  image: String (URL),
  author: ObjectId (ref: User._id, required),
  posts: [{ postId: ObjectId, order: Number }], // ordered array
  status: String (enum: ['draft', 'pending', 'approved'], default: 'draft'),
  isApprovedAt: Date,
  approvedBy: ObjectId,
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.blog_series.createIndex({ slug: 1 }, { unique: true })
db.blog_series.createIndex({ author: 1 })
```

#### 6. **products** (Marketplace)
```javascript
{
  _id: ObjectId,
  title: String (required, unique),
  slug: String (required, unique),
  description: String (required),
  image: String (URL, required),
  price: Number (required, min: 0),
  currency: String (default: 'USD', enum: ['USD', 'EUR', 'VND', 'GBP']),
  category: String (required, enum: ['templates', 'code', 'tools', 'courses']),
  tags: [String],
  author: ObjectId (ref: User._id, required),
  downloadUrl: String (required),
  preview: String (URL),
  status: String (enum: ['draft', 'pending', 'approved'], default: 'draft'),
  sales: Number (default: 0),
  rating: Number (min: 1, max: 5),
  ratingsCount: Number,
  reviews: [ObjectId], // ref: Review._id
  isApprovedAt: Date,
  approvedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ author: 1 })
db.products.createIndex({ category: 1 })
db.products.createIndex({ status: 1 })
db.products.createIndex({ createdAt: -1 })
```

#### 7. **purchases**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User._id, required),
  product: ObjectId (ref: Product._id, required),
  amount: Number (required),
  currency: String,
  paymentId: String (payment gateway ID: Stripe, PayPal, etc),
  paymentMethod: String (enum: ['stripe', 'paypal', 'card']),
  status: String (enum: ['completed', 'failed', 'refunded'], default: 'completed'),
  purchaseDate: Date (default: Date.now),
  expiresAt: Date, // license expiration (if applicable)
  downloadUrl: String (generated after purchase),
  downloadCount: Number (default: 0),
  maxDownloads: Number (default: -1), // -1 = unlimited
  createdAt: Date
}

// Indexes
db.purchases.createIndex({ user: 1 })
db.purchases.createIndex({ product: 1 })
db.purchases.createIndex({ status: 1 })
db.purchases.createIndex({ purchaseDate: -1 })
```

#### 8. **reviews** (Product Reviews)
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User._id, required),
  product: ObjectId (ref: Product._id, required),
  rating: Number (required, enum: [1, 2, 3, 4, 5]),
  content: String (required, max: 1000),
  helpful: [ObjectId], // User IDs who found helpful
  notHelpful: [ObjectId], // User IDs who didn't find helpful
  isVerifiedPurchase: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.reviews.createIndex({ product: 1 })
db.reviews.createIndex({ author: 1 })
db.reviews.createIndex({ createdAt: -1 })
```

#### 9. **tickets** (Support)
```javascript
{
  _id: ObjectId,
  subject: String (required),
  description: String (required),
  user: ObjectId (ref: User._id, required),
  product: ObjectId (ref: Product._id), // optional
  status: String (enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open'),
  priority: String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium'),
  assignedTo: ObjectId (ref: User._id), // admin/support agent
  messages: [ObjectId], // ref: TicketMessage._id
  messagesCount: Number,
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}

// Indexes
db.tickets.createIndex({ user: 1 })
db.tickets.createIndex({ status: 1 })
db.tickets.createIndex({ priority: 1 })
db.tickets.createIndex({ assignedTo: 1 })
```

#### 10. **ticket_messages**
```javascript
{
  _id: ObjectId,
  ticket: ObjectId (ref: Ticket._id, required),
  author: ObjectId (ref: User._id, required),
  content: String (required),
  isAdmin: Boolean (default: false),
  attachments: [String] (URLs),
  createdAt: Date
}

// Indexes
db.ticket_messages.createIndex({ ticket: 1 })
db.ticket_messages.createIndex({ createdAt: 1 })
```

#### 11. **resources** (Learning)
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique),
  description: String (required),
  type: String (enum: ['pdf', 'code', 'image', 'video'], required),
  fileUrl: String (required),
  fileSize: Number, // in bytes
  isPremium: Boolean (default: false),
  price: Number, // if premium
  author: ObjectId (ref: User._id, required),
  downloads: Number (default: 0),
  rating: Number (min: 1, max: 5),
  ratingsCount: Number,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.resources.createIndex({ slug: 1 }, { unique: true })
db.resources.createIndex({ type: 1 })
db.resources.createIndex({ isPremium: 1 })
```

#### 12. **badges**
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  icon: String (URL, required),
  description: String (required),
  criteria: Object, // conditions to earn (e.g., { postsCount: 5 })
  createdAt: Date
}
```

#### 13. **user_badges**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User._id, required),
  badge: ObjectId (ref: Badge._id, required),
  awardedAt: Date (default: Date.now),
  reason: String // why badge was awarded
}

// Indexes
db.user_badges.createIndex({ user: 1 })
```

---

## 🔧 Environment Setup

### 1. Create `.env` file
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/codeconnect_hub
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeconnect_hub

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=24h

# Frontend
FRONTEND_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:8080

# Email (SendGrid or Nodemailer)
SENDGRID_API_KEY=your_sendgrid_key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Storage (AWS S3 or local)
USE_AWS_S3=false
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=codeconnect-hub
AWS_S3_REGION=us-east-1

# OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payment (Stripe or PayPal)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Admin Email
ADMIN_EMAIL=admin@codeconnect.com
```

### 2. MongoDB Setup

**Local Development:**
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod

# Connect to MongoDB
mongo
# or newer versions:
mongosh
```

**MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Add connection string to `.env`

### 3. Project Structure
```
backend/
├── config/
│   ├── database.js
│   ├── mail.js
│   └── aws.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── blogController.js
│   ├── productController.js
│   ├── ticketController.js
│   ├── resourceController.js
│   └── statsController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── validation.js
│   └── rateLimit.js
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── BlogPost.js
│   ├── BlogSeries.js
│   ├── Product.js
│   ├── Purchase.js
│   ├── Review.js
│   ├── Ticket.js
│   ├── TicketMessage.js
│   ├── Resource.js
│   ├── Badge.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── blog.js
│   ├── products.js
│   ├── tickets.js
│   ├── resources.js
│   ├── stats.js
│   └── search.js
├── utils/
│   ├── validators.js
│   ├── helpers.js
│   └── emails.js
├── .env
├── .gitignore
├── app.js
├── server.js
└── package.json
```

---

## 🔐 Authentication Implementation

### JWT Token Flow

```javascript
// 1. User logs in
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// 2. Frontend stores token in localStorage
localStorage.setItem('authToken', token)

// 3. Frontend sends token in Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 4. Backend verifies token
```

### Password Security
```javascript
// Never store plain passwords
// Always hash with bcrypt

const bcrypt = require('bcryptjs');

// Hashing (during registration)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
user.password = hashedPassword;

// Verification (during login)
const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword);
```

---

## 📤 File Uploads

### Setup Multer for Local Storage

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

module.exports = upload;
```

### AWS S3 Integration (Recommended for Production)

```javascript
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'public-read',
  key: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  }
});

module.exports = upload;
```

---

## ⚠️ Error Handling

### Standardized Error Response
```javascript
// All errors should return consistent format
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Error Codes
```
400 - BAD_REQUEST
401 - UNAUTHORIZED
403 - FORBIDDEN
404 - NOT_FOUND
409 - CONFLICT (duplicate email, etc.)
429 - RATE_LIMITED
500 - INTERNAL_SERVER_ERROR
```

### Global Error Handler
```javascript
// In app.js
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
    code: err.code || 'ERROR'
  });
});
```

---

## 🧪 Testing

### Sample Tests with Jest

```javascript
// test/auth.test.js
describe('Authentication', () => {
  test('POST /api/auth/signup - should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login - should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

---

## 🚀 Deployment

### Environment: Production
```bash
# Update .env
NODE_ENV=production
FRONTEND_URL=https://codeconnect.com
```

### Deployment Options

1. **Heroku**
```bash
heroku login
heroku create codeconnect-hub-api
git push heroku main
```

2. **DigitalOcean/AWS EC2**
```bash
# SSH into server
# Install Node.js and MongoDB
# Clone repository
# npm install
# Create .env
# pm2 start server.js
```

3. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📝 API Implementation Checklist

### Phase 1: Core (Week 1)
- [ ] Database setup and models
- [ ] Authentication (signup, login, JWT)
- [ ] User profiles (CRUD)
- [ ] Error handling middleware

### Phase 2: Social Features (Week 2)
- [ ] Posts CRUD
- [ ] Comments system
- [ ] Likes/bookmarks functionality

### Phase 3: Blog Platform (Week 3)
- [ ] Blog posts CRUD
- [ ] Blog series management
- [ ] Content moderation

### Phase 4: Marketplace (Week 4)
- [ ] Products CRUD
- [ ] Purchase system (payment integration)
- [ ] Reviews and ratings

### Phase 5: Additional Features (Week 5)
- [ ] Support tickets
- [ ] Learning resources
- [ ] Statistics/leaderboard
- [ ] Search functionality

### Phase 6: Polish & Testing (Week 6)
- [ ] Testing all endpoints
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation

---

## 🔗 Quick API Reference

| Module | Endpoints Count |
|--------|-----------------|
| Authentication | 7 |
| Users | 9 |
| Posts | 17 |
| Blog | 22 |
| Products | 13 |
| Tickets | 7 |
| Resources | 8 |
| Badges | 2 |
| Stats | 1 |
| Search | 1 |
| **TOTAL** | **88** |

---

## 📚 Resources & References

- MongoDB Documentation: https://docs.mongodb.com/
- Express.js Guide: https://expressjs.com/
- JWT Best Practices: https://tools.ietf.org/html/rfc7519
- OWASP Security: https://owasp.org/
- REST API Best Practices: https://restfulapi.net/

---

## ✅ Final Notes

1. **Security First**: Always validate and sanitize user inputs
2. **Pagination**: Implement pagination for all list endpoints
3. **Caching**: Use Redis for frequently accessed data
4. **Logging**: Log all important operations for debugging
5. **Performance**: Create proper database indexes
6. **Scalability**: Design for horizontal scaling from the start
7. **Documentation**: Keep API documentation updated

---

Generated: 2026-01-29
