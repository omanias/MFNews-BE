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

## 📋 Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

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
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mfnews
DB_PORT=5432
JWT_SECRET=your_jwt_secret
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

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT, Passport
- **Documentation:** Swagger
- **Testing:** Jest
- **Containerization:** Docker

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.