# Adib's E-Store - Full Stack Commerce Web Application

A modern full-stack e-commerce web application built with React.js frontend and Spring Boot backend.

## 🚀 Features

- **Product Management**: Add, update, delete, and view products
- **Shopping Cart**: Add products to cart with quantity management
- **Product Categories**: Filter products by category (Laptop, Headphone, Mobile, Electronics, Toys, Fashion)
- **Search Functionality**: Search products by name
- **Image Upload**: Product images with blob storage
- **Responsive Design**: Modern UI with dark/light theme toggle
- **Stock Management**: Track product availability and stock quantities

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Bootstrap** - CSS framework for responsive design
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Spring Boot** - Java framework
- **Spring Data JPA** - Database ORM
- **H2 Database** - In-memory database (can be configured for production)
- **Maven** - Build tool

## 📁 Project Structure

```
FullStackCommerceCursor/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/ECommerceApplication/
│   │       ├── Controllers/ # REST API controllers
│   │       ├── Models/      # Entity models
│   │       ├── Repositories/# Data access layer
│   │       └── Services/    # Business logic
│   └── pom.xml
├── ecom-frontend-4-main/    # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── Context/         # React context for state
│   │   └── assets/          # Static assets
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ecom-frontend-4-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will start on `http://localhost:5173`

## 📖 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/product` - Add new product
- `PUT /api/product/{id}` - Update product
- `DELETE /api/product/{id}` - Delete product
- `GET /api/product/{id}/image` - Get product image

## 🎨 Features in Detail

### Product Management
- Add new products with images
- Update existing products
- Delete products
- View individual product details

### Shopping Cart
- Add products to cart
- Manage quantities
- Remove items from cart
- Checkout functionality

### User Interface
- Modern, responsive design
- Dark/light theme toggle
- Category filtering
- Search functionality
- Product image display

## 🔧 Configuration

The application uses default configurations for development. For production deployment, you may want to:

1. Configure a production database (MySQL, PostgreSQL)
2. Set up proper CORS configuration
3. Configure image storage (AWS S3, etc.)
4. Set up environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Adib Khandaker** - Full Stack Developer

---

⭐ Star this repository if you find it helpful! 