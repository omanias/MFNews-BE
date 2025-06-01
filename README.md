# MFNews Backend

Backend API for the MFNews application built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- RESTful API architecture
- Authentication using JWT and Passport
- PostgreSQL database integration
- Swagger API documentation
- Docker containerization
- TypeScript support
- Jest testing framework
- Role-based access control (Admin, Editor, User roles)
- Image upload and storage using LocalStack S3
- Pagination support for news listing
- Search functionality for news articles
- CORS configuration for frontend integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- LocalStack (for S3 storage)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mfnews-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mfnews
DB_PORT=5432
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret

# LocalStack S3 Configuration
LOCALSTACK_ENDPOINT=http://localhost:4566
LOCALSTACK_DEFAULT_REGION=us-east-1
LOCALSTACK_ACCESS_KEY_ID=test
LOCALSTACK_SECRET_ACCESS_KEY=test
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Using Docker
```bash
docker-compose up -d
```

## 🧪 Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## 🛠️ Tech Stack

- **Runtime:** Node.js (v16 or higher)
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT, Passport
- **Documentation:** Swagger
- **Testing:** Jest
- **Containerization:** Docker
- **Storage:** LocalStack S3 (bucket: news-images)
- **File Upload:** Multer
- **CORS:** Configured for http://localhost:5173

## 📁 Project Structure

```
src/
├── app.ts              # Application entry point
├── config/            # Configuration files
├── controllers/       # Route controllers
├── middlewares/       # Custom middlewares
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic
└── utils/            # Utility functions
```

## 🔐 Authentication & Authorization

The API uses JWT-based authentication with role-based access control:
- **Admin:** Full access to all endpoints
- **Editor:** Can create, update, and delete news articles
- **User:** Can view news articles and manage their profile

## 📝 API Endpoints

### News Endpoints
- `GET /api/news` - Get all news with pagination
- `GET /api/news/search` - Search news by title or author
- `POST /api/news` - Create a new news article (requires authentication)
- `PUT /api/news/:id` - Update a news article (requires authentication)
- `DELETE /api/news/:id` - Delete a news article (requires authentication)

### User Endpoints
- `GET /api/users` - Get all users (requires authentication)
- `POST /api/users` - Create a new user
- `POST /api/users/login` - User login
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.