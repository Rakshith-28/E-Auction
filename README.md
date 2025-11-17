# 🎯 BidGrid - Online Auction Platform

<div align="center">

![BidGrid Logo](https://via.placeholder.com/150x150.png?text=BidGrid)

**A modern, real-time auction platform for buying and selling items with competitive bidding**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Currency Information](#-currency-information)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Known Issues](#-known-issues)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Project Overview

**BidGrid** is a comprehensive online auction platform that enables users to buy and sell items through competitive real-time bidding. Built with modern web technologies, it provides a seamless experience for both sellers listing their items and buyers competing for the best deals.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based user authentication and authorization
- 💰 **Real-Time Bidding** - Live auction system with instant bid updates
- 🖼️ **Rich Media Support** - Multiple image uploads with interactive carousel display
- 🏷️ **Smart Categorization** - 23+ categories for easy item discovery
- 🔍 **Advanced Search** - Powerful filtering by price, category, time, and bid status
- 💳 **Payment Tracking** - Comprehensive payment record management
- 🔔 **Notifications** - Real-time alerts for bids, wins, and auction events
- 📊 **User Dashboards** - Personalized dashboards for buyers and sellers
- 🇮🇳 **INR Currency** - All transactions in Indian Rupees (₹)

---

## ✨ Features

### 🔐 User Authentication & Authorization
- User registration with email verification
- Secure login with JWT tokens
- Role-based access control (User/Admin)
- Profile management with avatar upload
- Password reset functionality

### 🛍️ Item Management
- Create item listings with detailed descriptions
- **Multiple image uploads** (drag-and-drop support)
- **Interactive image carousel** with:
  - Previous/Next navigation arrows
  - Dot indicators
  - Thumbnail strip
  - Keyboard support (arrow keys)
  - Image counter overlay
- 23 categories with emoji icons:
  - 📱 Electronics, 💻 Computers, 📱 Mobile
  - 👗 Fashion, 💎 Jewelry, 🎨 Collectibles
  - 🏠 Home, 🪑 Furniture, 🔌 Appliances
  - 🍳 Kitchen, ⚽ Sports, 🏕️ Outdoor
  - 🎸 Music, 📚 Books, 🧸 Toys
  - 🚗 Automotive, 🔧 Tools, 💊 Health
  - 👶 Baby, 🐾 Pets, 📎 Office
  - 🛒 Groceries, 📦 Other
- Set minimum bid and bid increment in ₹
- Define auction start and end times
- Edit/Delete listings (sellers only)
- Item status tracking (PENDING, ACTIVE, SOLD, CLOSED)

### 💸 Bidding System
- Place bids on active auctions
- Real-time bid validation
- Automatic bid increment enforcement
- Bid history tracking
- Highest bidder highlighting
- Auction countdown timers
- Autobid notifications

### 🔍 Browse & Search
- Category-based filtering
- Price range sliders (₹0 - ₹100,000)
- Sort by:
  - Ending soon
  - Ending latest
  - Newest listings
  - Price: Low to High / High to Low
- Advanced filters:
  - Bid status (With Bids / No Bids)
  - Time remaining (<1h, <6h, <24h, >24h)
- Search by keywords
- Pagination support

### 🛒 Shopping Cart
- Add items to cart
- Cart count badge
- Quick checkout

### 💳 Payment Management
- Payment record creation
- Payment status tracking
- Transaction history
- Payment verification

### 🔔 Notifications
- Real-time notification system
- Notification types:
  - New bid on your item
  - You've been outbid
  - Auction won
  - Auction ending soon
  - Payment received/pending
- Mark as read/unread
- Notification center with filters

### 📊 Dashboards
- **Seller Dashboard**:
  - Active listings
  - Received bids
  - Sold items
  - Revenue tracking (₹)
  - Performance metrics
- **Buyer Dashboard**:
  - Active bids
  - Won items
  - Watchlist
  - Bid history
  - Spending analytics (₹)
- **Admin Dashboard**:
  - User management
  - Item moderation
  - Platform statistics
  - Revenue reports

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3+ - UI library
- **Vite** - Build tool and dev server
- **React Router** 6+ - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Firebase** - Authentication & Cloud Storage (optional)

### Backend
- **Spring Boot** 3.3.4 - Java framework
- **Java** 21 - Programming language
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Spring Data MongoDB** - Database integration
- **Maven** - Dependency management
- **Lombok** - Boilerplate code reduction

### Database
- **MongoDB** 5.0+ - NoSQL document database
- **MongoDB Atlas** - Cloud database hosting (optional)

### Additional Tools
- **Cloudinary** - Image hosting and optimization (optional)
- **Postman** - API testing
- **Git** - Version control

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16+ and npm
  ```bash
  node --version  # v16.0.0 or higher
  npm --version   # 8.0.0 or higher
  ```

- **Java** 21+
  ```bash
  java -version   # 21.0.0 or higher
  ```

- **Maven** 3.8+
  ```bash
  mvn -version    # 3.8.0 or higher
  ```

- **MongoDB** 5.0+ (Local or Atlas)
  ```bash
  mongod --version  # 5.0.0 or higher
  ```

- **Git**
  ```bash
  git --version
  ```

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Rakshith-28/E-Auction.git
cd E-Auction
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd eauction-backend

# Install dependencies (Maven will download them automatically)
mvn clean install

# Skip tests if needed
mvn clean install -DskipTests

# Create uploads directory for images
mkdir uploads
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd ../eauction-frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

---

## ⚙️ Environment Variables

### Backend Configuration

Create or edit `eauction-backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080
spring.application.name=eauction-backend

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/eauction
# For MongoDB Atlas:
# spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/eauction?retryWrites=true&w=majority

# JWT Configuration
jwt.secret=your-256-bit-secret-key-here-change-this-in-production
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Static Resource Handling
spring.web.resources.static-locations=file:./uploads/

# CORS Configuration
cors.allowed.origins=http://localhost:5173,http://localhost:3000

# Cloudinary Configuration (Optional)
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret

# Logging
logging.level.com.eauction=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Frontend Configuration

Create `eauction-frontend/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_BASE_URL=http://localhost:8080

# Socket Configuration (if using WebSockets)
VITE_SOCKET_URL=ws://localhost:8080/ws

# Cloudinary Configuration (Optional)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

---

## 🗄️ Database Schema

### Collections Overview

| Collection | Description |
|------------|-------------|
| `users` | User accounts and profiles |
| `items` | Auction items/listings |
| `bids` | Bid records |
| `categories` | Item categories |
| `paymentRecords` | Payment transactions |
| `notifications` | User notifications |

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,              // Unique, required
  password: String,           // Hashed
  username: String,           // Unique
  fullName: String,
  phoneNumber: String,
  role: String,               // "USER" or "ADMIN"
  avatar: String,             // URL or path
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  emailVerified: Boolean
}
```

### Items Collection

```javascript
{
  _id: ObjectId,
  title: String,              // Required
  description: String,
  category: String,           // Electronics, Fashion, etc.
  images: [String],           // Array of image URLs/paths
  imageUrl: String,           // Primary image (deprecated, use images[0])
  condition: String,          // New, Like New, Good, Fair, Poor
  minimumBid: Double,         // Starting bid in ₹
  currentBid: Double,         // Highest bid in ₹
  bidIncrement: Double,       // Minimum increment in ₹
  price: Double,              // Buy-now price in ₹ (optional)
  sellerId: ObjectId,         // Reference to users collection
  sellerName: String,
  auctionStartTime: Date,     // ISO 8601 format
  auctionEndTime: Date,       // ISO 8601 format
  status: String,             // PENDING, ACTIVE, SOLD, CLOSED
  totalBids: Integer,
  winnerId: ObjectId,         // User who won the auction
  createdAt: Date,
  updatedAt: Date
}
```

### Bids Collection

```javascript
{
  _id: ObjectId,
  itemId: ObjectId,           // Reference to items
  bidderId: ObjectId,         // Reference to users
  bidderName: String,
  bidAmount: Double,          // Bid amount in ₹
  bidTime: Date,
  isWinningBid: Boolean,
  status: String,             // ACTIVE, OUTBID, WON, LOST
  createdAt: Date
}
```

### Payment Records Collection

```javascript
{
  _id: ObjectId,
  itemId: ObjectId,           // Reference to items
  buyerId: ObjectId,          // Reference to users
  sellerId: ObjectId,         // Reference to users
  amount: Double,             // Payment amount in ₹
  currency: String,           // "INR"
  paymentMethod: String,      // UPI, Card, NetBanking, etc.
  transactionId: String,      // Unique transaction ID
  status: String,             // PENDING, COMPLETED, FAILED, REFUNDED
  paymentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Recipient user
  type: String,               // BID_PLACED, BID_OUTBID, AUCTION_WON, AUCTION_ENDING, PAYMENT_RECEIVED
  title: String,
  message: String,
  itemId: ObjectId,           // Related item (optional)
  relatedUserId: ObjectId,    // Related user (optional)
  isRead: Boolean,
  createdAt: Date,
  readAt: Date
}
```

---

## 🏃 Running the Application

### Start MongoDB

```bash
# Local MongoDB
mongod --dbpath /path/to/data/db

# Or if using MongoDB Atlas, ensure connection string is configured
```

### Start Backend Server

```bash
cd eauction-backend

# Run with Maven
mvn spring-boot:run

# Or run the JAR file
mvn clean package
java -jar target/eauction-backend-0.0.1-SNAPSHOT.jar

# Backend will start at http://localhost:8080
```

### Start Frontend Development Server

```bash
cd eauction-frontend

# Run with npm
npm run dev

# Or with yarn
yarn dev

# Frontend will start at http://localhost:5173
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **API Health Check**: http://localhost:8080/actuator/health

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "fullName": "John Doe",
  "phoneNumber": "+91-9876543210"
}

Response (201 Created):
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe",
  "role": "USER"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

### Item Endpoints

#### Get Active Items (Browse)
```http
GET /items/active?page=0&size=12&sort=auctionEndTime,asc&category=Electronics

Response (200 OK):
{
  "content": [
    {
      "id": "691610a45841816d7f2fe28b",
      "title": "2021 MacBook Pro (M1, 16GB RAM)",
      "description": "Lightly used 13\" MacBook Pro...",
      "category": "ELECTRONICS",
      "images": [
        "/uploads/8d9f6d40-0946-45c3-970a-bbd5bc42cd8e.webp",
        "/uploads/7e8c5b30-1837-44b2-869b-aac4ab31bd7f.webp"
      ],
      "condition": "Like New",
      "minimumBid": 75000.0,
      "currentBid": 83000.0,
      "bidIncrement": 1000.0,
      "sellerId": "69160e8e5841816d7f2fe28a",
      "sellerName": "User1",
      "auctionStartTime": "2025-11-13T17:09:00Z",
      "auctionEndTime": "2025-11-30T17:08:00Z",
      "status": "ACTIVE",
      "totalBids": 8
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 12
  },
  "totalElements": 10,
  "totalPages": 1,
  "last": true
}
```

#### Create Item Listing
```http
POST /items
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  title: "Vintage Leather Handbag"
  description: "Genuine leather handbag in excellent condition..."
  category: "Fashion"
  condition: "Like New"
  minimumBid: 5000
  bidIncrement: 500
  auctionStartTime: "2025-11-20T10:00:00Z"
  auctionEndTime: "2025-11-25T10:00:00Z"
  images: [File, File, File]  // Multiple image files

Response (201 Created):
{
  "id": "691a28a9388fe940ee20d654",
  "title": "Vintage Leather Handbag",
  "minimumBid": 5000.0,
  "currentBid": 5000.0,
  "images": [
    "/uploads/8d9f6d40-0946-45c3-970a-bbd5bc42cd8e.webp",
    "/uploads/7e8c5b30-1837-44b2-869b-aac4ab31bd7f.webp",
    "/uploads/9f7d4a20-2948-55d4-a71c-bce5cd42ef9a.webp"
  ],
  "status": "PENDING"
}
```

#### Get Item Details
```http
GET /items/{itemId}

Response (200 OK):
{
  "id": "691610a45841816d7f2fe28b",
  "title": "2021 MacBook Pro (M1, 16GB RAM)",
  "images": [...],
  "minimumBid": 75000.0,
  "currentBid": 83000.0,
  "totalBids": 8,
  "seller": {
    "id": "69160e8e5841816d7f2fe28a",
    "username": "User1",
    "avatar": "/uploads/avatar.jpg",
    "phoneNumber": "+91-9876543210"
  },
  "bids": [
    {
      "bidderId": "507f1f77bcf86cd799439012",
      "bidderName": "johndoe",
      "bidAmount": 83000.0,
      "bidTime": "2025-11-17T15:30:00Z"
    }
  ]
}
```

#### Update Item
```http
PUT /items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "minimumBid": 80000.0
}

Response (200 OK):
{
  "id": "691610a45841816d7f2fe28b",
  "title": "Updated Title",
  "minimumBid": 80000.0
}
```

#### Delete Item
```http
DELETE /items/{itemId}
Authorization: Bearer <token>

Response (204 No Content)
```

### Bid Endpoints

#### Place Bid
```http
POST /bids
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemId": "691610a45841816d7f2fe28b",
  "bidAmount": 84000.0
}

Response (201 Created):
{
  "id": "691b15c8498gf851ff31e765",
  "itemId": "691610a45841816d7f2fe28b",
  "bidderId": "507f1f77bcf86cd799439012",
  "bidAmount": 84000.0,
  "bidTime": "2025-11-17T16:45:00Z",
  "status": "ACTIVE"
}
```

#### Get User's Bids
```http
GET /bids/my-bids?page=0&size=10
Authorization: Bearer <token>

Response (200 OK):
{
  "content": [
    {
      "id": "691b15c8498gf851ff31e765",
      "item": {
        "id": "691610a45841816d7f2fe28b",
        "title": "2021 MacBook Pro (M1, 16GB RAM)",
        "images": [...]
      },
      "bidAmount": 84000.0,
      "isWinningBid": true,
      "status": "ACTIVE"
    }
  ],
  "totalElements": 5
}
```

#### Get Bids on Item
```http
GET /items/{itemId}/bids?page=0&size=20

Response (200 OK):
[
  {
    "bidderId": "507f1f77bcf86cd799439012",
    "bidderName": "johndoe",
    "bidAmount": 84000.0,
    "bidTime": "2025-11-17T16:45:00Z"
  },
  {
    "bidderId": "507f1f77bcf86cd799439013",
    "bidderName": "janedoe",
    "bidAmount": 83000.0,
    "bidTime": "2025-11-17T15:30:00Z"
  }
]
```

### User Profile Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>

Response (200 OK):
{
  "id": "507f1f77bcf86cd799439012",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "phoneNumber": "+91-9876543210",
  "avatar": "/uploads/avatar.jpg",
  "address": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  }
}
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Updated Doe",
  "phoneNumber": "+91-9876543211",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}

Response (200 OK):
{
  "id": "507f1f77bcf86cd799439012",
  "fullName": "John Updated Doe",
  "phoneNumber": "+91-9876543211"
}
```

### Notification Endpoints

#### Get User Notifications
```http
GET /notifications?page=0&size=20&unreadOnly=true
Authorization: Bearer <token>

Response (200 OK):
{
  "content": [
    {
      "id": "691c27d9509hg962gg42f876",
      "type": "BID_PLACED",
      "title": "New Bid on Your Item",
      "message": "johndoe placed a bid of ₹84,000 on MacBook Pro",
      "itemId": "691610a45841816d7f2fe28b",
      "isRead": false,
      "createdAt": "2025-11-17T16:45:00Z"
    }
  ],
  "totalElements": 12
}
```

#### Mark Notification as Read
```http
PUT /notifications/{notificationId}/read
Authorization: Bearer <token>

Response (200 OK):
{
  "id": "691c27d9509hg962gg42f876",
  "isRead": true,
  "readAt": "2025-11-17T17:00:00Z"
}
```

---

## 📁 Project Structure

### Backend Structure

```
eauction-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── eauction/
│   │   │           ├── EauctionBackendApplication.java
│   │   │           ├── config/
│   │   │           │   ├── CorsConfig.java
│   │   │           │   ├── MongoConfig.java
│   │   │           │   └── WebConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── ItemController.java
│   │   │           │   ├── BidController.java
│   │   │           │   ├── UserController.java
│   │   │           │   ├── NotificationController.java
│   │   │           │   ├── PaymentController.java
│   │   │           │   └── UploadController.java
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Item.java
│   │   │           │   ├── Bid.java
│   │   │           │   ├── PaymentRecord.java
│   │   │           │   ├── Notification.java
│   │   │           │   └── enums/
│   │   │           │       ├── ItemStatus.java
│   │   │           │       ├── BidStatus.java
│   │   │           │       ├── PaymentStatus.java
│   │   │           │       └── UserRole.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── ItemRepository.java
│   │   │           │   ├── BidRepository.java
│   │   │           │   ├── PaymentRepository.java
│   │   │           │   └── NotificationRepository.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── ItemService.java
│   │   │           │   ├── BidService.java
│   │   │           │   ├── UserService.java
│   │   │           │   ├── NotificationService.java
│   │   │           │   ├── PaymentService.java
│   │   │           │   └── UploadService.java
│   │   │           ├── security/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   └── CustomUserDetailsService.java
│   │   │           ├── util/
│   │   │           │   ├── CurrencyUtil.java
│   │   │           │   └── DateUtil.java
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── RegisterRequest.java
│   │   │           │   │   ├── CreateItemRequest.java
│   │   │           │   │   └── PlaceBidRequest.java
│   │   │           │   └── response/
│   │   │           │       ├── AuthResponse.java
│   │   │           │       ├── ItemResponse.java
│   │   │           │       └── BidResponse.java
│   │   │           └── exception/
│   │   │               ├── GlobalExceptionHandler.java
│   │   │               ├── ResourceNotFoundException.java
│   │   │               ├── BadRequestException.java
│   │   │               └── UnauthorizedException.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-prod.properties
│   └── test/
│       └── java/
│           └── com/
│               └── eauction/
│                   ├── ItemServiceTest.java
│                   ├── BidServiceTest.java
│                   └── AuthServiceTest.java
├── uploads/                    # Image uploads directory
├── pom.xml
└── README.md
```

### Frontend Structure

```
eauction-frontend/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── Auction/
│   │   │   ├── AuctionCard.jsx
│   │   │   ├── AuctionList.jsx
│   │   │   ├── BidConfirmationModal.jsx
│   │   │   └── CountdownTimer.jsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Common/
│   │   │   ├── CountdownTimer.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── PageContainer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TypingQuote.jsx
│   │   ├── Dashboard/
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── BuyerDashboard.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── Item/
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   ├── ImageCarousel.jsx
│   │   │   └── ImageUpload.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Notifications/
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   └── NotificationList.jsx
│   │   ├── Payments/
│   │   │   ├── PaymentForm.jsx
│   │   │   └── PaymentHistory.jsx
│   │   └── Profile/
│   │       ├── ProfileCard.jsx
│   │       ├── EditProfile.jsx
│   │       └── AvatarUpload.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AuctionDetailsPage.jsx
│   │   ├── AuctionsPage.jsx
│   │   ├── BidHistoryPage.jsx
│   │   ├── BrowseItemsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CreateItemPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── EditItemPage.jsx
│   │   ├── EditProfilePage.jsx
│   │   ├── HelpPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ItemDetailsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyBidsPage.jsx
│   │   ├── MyItemsPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── NotificationCenterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ReceivedBidsPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── SoldItemsPage.jsx
│   │   ├── ViewProfilePage.jsx
│   │   ├── WatchlistPage.jsx
│   │   └── WonItemsPage.jsx
│   ├── services/
│   │   ├── adminService.js
│   │   ├── api.js
│   │   ├── auctionService.js
│   │   ├── authService.js
│   │   ├── bidService.js
│   │   ├── cartService.js
│   │   ├── itemService.js
│   │   ├── notificationService.js
│   │   ├── paymentService.js
│   │   ├── uploadService.js
│   │   ├── userService.js
│   │   └── watchlistService.js
│   ├── utils/
│   │   ├── currencyUtils.js
│   │   ├── dateUtils.js
│   │   ├── tokenUtils.js
│   │   └── validators.js
│   ├── App.css
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 📖 Usage Guide

### For Sellers

#### 1. Creating a Listing

1. **Login** to your account
2. Navigate to **"My Listings"** → **"Create New Item"**
3. Fill in the item details:
   - **Title**: Clear, descriptive name
   - **Category**: Select from 23 categories
   - **Description**: Detailed item information
   - **Condition**: New, Like New, Good, Fair, or Poor
   - **Images**: Drag-and-drop or click to upload (multiple images supported)
   - **Minimum Bid**: Starting price in ₹
   - **Bid Increment**: Minimum bid increase in ₹
   - **Auction Period**: Start and end date/time
4. Click **"Create Listing"**
5. Item status will be **PENDING** until start time, then **ACTIVE**

#### 2. Managing Listings

- **View Active Listings**: Dashboard → "My Items"
- **Edit Item**: Click item → "Edit" (only before first bid)
- **Delete Item**: Click item → "Delete" (only if no bids)
- **View Bids**: Click item → "Received Bids" tab
- **Track Performance**: Dashboard shows revenue, bid count, views

#### 3. Handling Sales

- Monitor received bids in real-time
- Get notifications when new bids arrive
- When auction ends:
  - Item marked as **SOLD** if bids exist
  - Winner receives notification
  - Create payment record
- View sold items in **"Sold Items"** section

### For Buyers

#### 1. Browsing Items

1. Navigate to **"Browse Items"**
2. Use filters:
   - **Categories**: Filter by category buttons
   - **Sort**: Ending soon, newest, price
   - **Price Range**: Adjust sliders (₹0 - ₹100,000)
   - **Advanced Filters**: 
     - Bid Status (With Bids / No Bids)
     - Time Remaining (<1h, <6h, <24h, >24h)
3. Click item card to view details

#### 2. Viewing Item Details

- **Image Carousel**: 
  - Click arrows to navigate
  - Click thumbnails for quick access
  - Use keyboard arrow keys
  - See image count badge
- **Item Information**: Title, description, condition, category
- **Seller Contact**: View seller profile, phone number
- **Bidding Info**: Current bid, minimum bid, bid increment
- **Time Remaining**: Live countdown timer
- **Bid History**: See all bids with timestamps

#### 3. Placing Bids

1. Click **"Place Bid"** button
2. Enter bid amount (must be ≥ currentBid + bidIncrement)
3. Confirm in modal dialog
4. Receive confirmation notification
5. Monitor bid status in **"My Bids"**

#### 4. Winning Auctions

- Receive notification when auction ends if you're the highest bidder
- Item appears in **"Won Items"** section
- Complete payment through payment flow
- Contact seller for delivery

### Dashboard Features

#### Seller Dashboard
- **Active Listings Count**: See all active auctions
- **Total Revenue**: Sum of all sold items in ₹
- **Received Bids**: Latest bids on your items
- **Performance Metrics**: Views, conversion rate
- **Quick Actions**: Create new listing, view analytics

#### Buyer Dashboard
- **Active Bids Count**: Number of ongoing bids
- **Won Items Count**: Auctions you've won
- **Total Spent**: Sum of won auctions in ₹
- **Watchlist**: Saved items for later
- **Bid History**: All your bidding activity
- **Quick Actions**: Browse items, view wins

---

## 💱 Currency Information

### Indian Rupee (INR) Implementation

**BidGrid exclusively uses Indian Rupees (₹) for all transactions.**

#### Key Points

- ✅ **All amounts stored in INR** (Double type in database)
- ✅ **No USD conversion** in the application
- ✅ **Display format**: ₹X,XXX.XX (e.g., ₹84,000.00)
- ✅ **Historical reference**: 1 USD ≈ ₹83 (for old data migration)

#### Currency Formatting

**Frontend** (`currencyUtils.js`):
```javascript
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Usage
formatCurrency(84000);  // "₹84,000"
formatCurrency(1250.50); // "₹1,250.50"
```

**Backend** (`CurrencyUtil.java`):
```java
public class CurrencyUtil {
    public static String formatINR(Double amount) {
        if (amount == null) return "₹0";
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        return formatter.format(amount);
    }
}
```

#### Database Storage

All monetary fields stored as `Double` in INR:
- `minimumBid`: Starting bid in ₹
- `currentBid`: Highest bid in ₹
- `bidIncrement`: Minimum increase in ₹
- `price`: Buy-now price in ₹
- `bidAmount`: Bid amount in ₹
- `paymentAmount`: Payment in ₹

#### Migration from USD

If you have old data in USD, use the migration script:

```bash
# Run migration script
node migrate-usd-to-inr.js

# Or using mongosh
mongosh < migrate-mongosh.js
```

**Migration formula**: `INR = USD × 83`

---

## 🧪 Testing

### Backend Tests

```bash
cd eauction-backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ItemServiceTest

# Run with coverage
mvn test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Frontend Tests

```bash
cd eauction-frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ItemCard.test.jsx
```

### API Testing with Postman

1. Import the Postman collection (if available)
2. Set environment variables:
   - `baseUrl`: http://localhost:8080/api
   - `authToken`: Your JWT token
3. Test endpoints in order:
   - Auth → Register/Login
   - Items → Create/Read/Update/Delete
   - Bids → Place/View
   - Profile → View/Update

---

## 🚀 Deployment

### Option 1: DigitalOcean Droplet (Full Stack)

#### 1. Create Droplet

```bash
# Ubuntu 22.04 LTS, 2GB RAM minimum
ssh root@your-droplet-ip
```

#### 2. Install Java & Maven

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install openjdk-21-jdk -y
java -version

# Install Maven
sudo apt install maven -y
mvn -version
```

#### 3. Install MongoDB

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 4. Deploy Backend

```bash
# Clone repository
git clone https://github.com/Rakshith-28/E-Auction.git
cd E-Auction/eauction-backend

# Build application
mvn clean package -DskipTests

# Create systemd service
sudo nano /etc/systemd/system/eauction-backend.service
```

**Service file content**:
```ini
[Unit]
Description=BidGrid Backend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/E-Auction/eauction-backend
ExecStart=/usr/bin/java -jar target/eauction-backend-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl start eauction-backend
sudo systemctl enable eauction-backend
sudo systemctl status eauction-backend
```

#### 5. Install Node.js & Build Frontend

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Build frontend
cd /root/E-Auction/eauction-frontend
npm install
npm run build
```

#### 6. Install & Configure Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/bidgrid
```

**Nginx configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /root/E-Auction/eauction-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (uploads)
    location /uploads {
        alias /root/E-Auction/eauction-backend/uploads;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bidgrid /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

### Option 2: MongoDB Atlas (Cloud Database)

#### 1. Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string

#### 2. Update Backend Configuration

```properties
# application.properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/eauction?retryWrites=true&w=majority
```

### Option 3: Frontend on Netlify

#### 1. Build Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 2. Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### 3. Environment Variables

Add in Netlify dashboard:
- `VITE_API_URL`: https://api.your-domain.com/api
- `VITE_BASE_URL`: https://api.your-domain.com

### Option 4: Frontend on Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard.

---

## 🤝 Contributing

We welcome contributions to BidGrid! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR-USERNAME/E-Auction.git
   cd E-Auction
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with bidding"
   ```

   **Commit message format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Test additions/changes
   - `chore:` Build/tooling changes

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe changes clearly
   - Link related issues

### Code Style Guidelines

#### Backend (Java)
- Use Java 21 features
- Follow Spring Boot conventions
- Use Lombok for boilerplate reduction
- Write JavaDoc for public methods
- Use meaningful variable names
- Keep methods under 50 lines

#### Frontend (JavaScript/React)
- Use functional components with hooks
- Follow ESLint rules
- Use Tailwind CSS classes
- Extract reusable components
- Use proper prop types
- Write self-documenting code

### Testing Requirements

- Add unit tests for new features
- Maintain test coverage above 70%
- Test edge cases and error scenarios
- Update integration tests if needed

### Documentation

- Update README for new features
- Add JSDoc/JavaDoc comments
- Update API documentation
- Include code examples

---

## ⚠️ Known Issues

### 1. Image Upload Issues
- **Issue**: Large images (>5MB) fail to upload
- **Workaround**: Compress images before upload
- **Status**: Working on client-side compression

### 2. Notification Delays
- **Issue**: Notifications sometimes delayed by 5-10 seconds
- **Cause**: Polling interval set to 30 seconds
- **Workaround**: Refresh page or wait
- **Status**: Planning WebSocket implementation

### 3. Mobile Responsiveness
- **Issue**: Advanced filters overflow on screens <375px
- **Workaround**: Use landscape mode or larger device
- **Status**: Fix planned for v2.1

### 4. Browser Compatibility
- **Issue**: Image carousel keyboard navigation doesn't work in Safari <14
- **Workaround**: Use Chrome/Firefox or click arrows
- **Status**: Investigating polyfill solutions

### 5. Time Zone Display
- **Issue**: Auction times show in UTC, not user's local time
- **Workaround**: Manually convert to your timezone
- **Status**: Will add timezone conversion in next release

### 6. Search Performance
- **Issue**: Search slows down with 10,000+ items
- **Workaround**: Use category filters to narrow results
- **Status**: Database indexing optimization planned

---

## 🔮 Future Enhancements

### Planned Features (v2.0)

#### Payment Gateway Integration
- [ ] Razorpay integration
- [ ] UPI payment support
- [ ] Card payment processing
- [ ] Payment verification
- [ ] Automatic refunds

#### Mobile Applications
- [ ] React Native iOS app
- [ ] React Native Android app
- [ ] Push notifications
- [ ] Fingerprint authentication
- [ ] Offline mode

#### Advanced Bidding
- [ ] **Proxy Bidding**: Set max bid, system auto-bids for you
- [ ] **Buy Now**: Option to purchase immediately
- [ ] **Reserve Price**: Hidden minimum price
- [ ] **Dutch Auction**: Price decreases over time
- [ ] **Bid Retraction**: Cancel bid within 1 hour

#### AI & ML Features
- [ ] **Smart Recommendations**: ML-based item suggestions
- [ ] **Price Prediction**: Estimate final auction price
- [ ] **Fraud Detection**: Identify suspicious bidding patterns
- [ ] **Image Recognition**: Auto-categorize items from photos
- [ ] **Chatbot**: AI assistant for customer support

#### Social Features
- [ ] User ratings & reviews
- [ ] Follow favorite sellers
- [ ] Share items on social media
- [ ] Community forums
- [ ] Seller verification badges

#### Analytics & Reporting
- [ ] Seller analytics dashboard
- [ ] Buyer spending reports
- [ ] Export data to CSV/Excel
- [ ] Email reports (weekly/monthly)
- [ ] Platform-wide statistics (admin)

#### Internationalization
- [ ] Multi-language support (Hindi, Tamil, Bengali, etc.)
- [ ] Multi-currency support (USD, EUR, GBP)
- [ ] Regional pricing
- [ ] Localized content
- [ ] RTL language support (Arabic, Hebrew)

#### Performance Optimizations
- [ ] Redis caching layer
- [ ] CDN for images
- [ ] GraphQL API option
- [ ] Server-side rendering (SSR)
- [ ] Progressive Web App (PWA)

#### Security Enhancements
- [ ] Two-factor authentication (2FA)
- [ ] Email verification for registration
- [ ] Rate limiting on API endpoints
- [ ] CAPTCHA for bid placement
- [ ] Audit logs for admin actions

### Requested Features (Community)

Vote for features on our [GitHub Discussions](https://github.com/Rakshith-28/E-Auction/discussions).

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Rakshith-28

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See [LICENSE](LICENSE) file for details.

---

## 📞 Contact

### Project Maintainer

**Rakshith**
- GitHub: [@Rakshith-28](https://github.com/Rakshith-28)
- Email: [rakshith@example.com](mailto:rakshith@example.com)
- LinkedIn: [linkedin.com/in/rakshith](https://linkedin.com/in/rakshith)

### Support Channels

- **Bug Reports**: [GitHub Issues](https://github.com/Rakshith-28/E-Auction/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Rakshith-28/E-Auction/discussions)
- **Security Issues**: [Email privately](mailto:security@example.com)
- **General Questions**: [Discord Server](https://discord.gg/bidgrid) (coming soon)

### Community

- Star ⭐ this repository if you find it helpful!
- Follow for updates on new features
- Share your feedback and suggestions
- Contribute to make BidGrid better

---

## 🙏 Acknowledgments

### Technologies & Frameworks
- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
- [React](https://reactjs.org/) - Frontend library
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool

### Inspirations
- eBay - Auction platform reference
- Amazon - User experience inspiration
- Alibaba - Category organization

### Contributors
Special thanks to all contributors who have helped improve BidGrid!

<!-- Add contributor list automatically with all-contributors -->

### Resources
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [JWT.io](https://jwt.io/) - JWT debugging
- [Heroicons](https://heroicons.com/) - Icon set

---

<div align="center">

**Built with ❤️ by Rakshith-28**

⭐ Star this repository if you like the project!

[Report Bug](https://github.com/Rakshith-28/E-Auction/issues) • [Request Feature](https://github.com/Rakshith-28/E-Auction/discussions) • [Documentation](https://github.com/Rakshith-28/E-Auction/wiki)

</div>
