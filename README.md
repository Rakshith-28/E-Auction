# 🎯 BidGrid - Online Auction Platform

A modern, real-time auction platform for buying and selling items with competitive bidding.

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

## 🌟 Overview

BidGrid is a full-stack auction platform enabling users to buy and sell items through real-time bidding. Features include JWT authentication, multiple image uploads with carousel display, 23+ categories, advanced search filters, payment tracking, and real-time notifications. All transactions in Indian Rupees (₹)

## ✨ Features

- 🔐 JWT authentication & role-based access
- 🖼️ Multiple image uploads with carousel (arrows, thumbnails, keyboard navigation)
- 🏷️ 23 categories (Electronics, Fashion, Books, etc.)
- 💸 Real-time bidding with validation
- 🔍 Advanced filters (price, category, time, bid status)
- 🔔 Real-time notifications
- 📊 Seller & buyer dashboards
- 💳 Payment tracking
- 🛒 Shopping cart
- 🇮🇳 All amounts in INR (₹)

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, Axios  
**Backend:** Spring Boot 3.3.4, Java 21, Spring Security, JWT  
**Database:** MongoDB 5.0+  

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java 21+
- Maven 3.8+
- MongoDB 5.0+

### Installation

```bash
# Clone repository
git clone https://github.com/Rakshith-28/E-Auction.git
cd E-Auction

# Backend setup
cd eauction-backend
mvn clean install
mkdir uploads

# Frontend setup
cd ../eauction-frontend
npm install
```

### Configuration

**Backend** (`application.properties`):
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/eauction
jwt.secret=your-secret-key
server.port=8080
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8080/api
VITE_BASE_URL=http://localhost:8080
```

### Run

```bash
# Start backend
cd eauction-backend
mvn spring-boot:run

# Start frontend (new terminal)
cd eauction-frontend
npm run dev
```

Access at: http://localhost:5173

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### Items
- `GET /items/active` - Get active items (paginated)
- `POST /items` - Create item (multipart/form-data)
- `GET /items/{id}` - Get item details
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

### Bids
- `POST /bids` - Place bid
- `GET /bids/my-bids` - Get user's bids
- `GET /items/{id}/bids` - Get item bids

### User
- `GET /users/profile` - Get profile
- `PUT /users/profile` - Update profile

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/{id}/read` - Mark as read

## 🗄️ Database Schema

**Items Collection:**
```javascript
{
  title: String,
  description: String,
  category: String,
  images: [String],        // Array of image paths
  minimumBid: Double,      // Amount in ₹
  currentBid: Double,      // Amount in ₹
  bidIncrement: Double,    // Amount in ₹
  sellerId: ObjectId,
  auctionStartTime: Date,
  auctionEndTime: Date,
  status: String,          // PENDING, ACTIVE, SOLD, CLOSED
  totalBids: Integer
}
```

**Users, Bids, PaymentRecords, Notifications collections** follow similar structure.

## 💱 Currency

All monetary values stored and displayed in **Indian Rupees (₹)**. No USD conversion.

```javascript
// Frontend formatting
formatCurrency(84000);  // "₹84,000"
```

## 🧪 Testing

```bash
# Backend
mvn test

# Frontend
npm test
```

## 🚀 Deployment

### DigitalOcean Droplet
1. Install Java 21, Maven, MongoDB, Nginx
2. Build: `mvn clean package`
3. Create systemd service
4. Configure Nginx reverse proxy
5. SSL with Let's Encrypt

### MongoDB Atlas
Update `spring.data.mongodb.uri` with Atlas connection string

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 📞 Contact

**Rakshith**  
GitHub: [@Rakshith-28](https://github.com/Rakshith-28)

---

⭐ Star this repo if you find it helpful!
