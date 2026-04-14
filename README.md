# AI-Powered MERN E-Commerce Platform - AuraShop

Welcome to your production-grade, AI-powered E-Commerce application. It features a complete MERN stack (MongoDB, Express, React, Node.js) split into frontend and backend folders, with a comprehensive Machine Learning recommender engine built natively into the backend using `natural` (TF-IDF) and Cosine Similarity calculation, meaning no messy Python servers are needed!

## Features Delivered
- **Frontend**: Vite + React + Redux Toolkit + Tailwind CSS. Beautiful modern layout with glassmorphism, responsive navigation, full page layouts (Home, Shop, Cart, Register, Admin). Features local dummy API fallbacks.
- **Backend API**: Node.js + Express with proper MVC (Routes & Controllers) setup. Error handling and Auth Middleware implemented. 
- **Database schemas**: Mongoose Schemas (User, Product, Order, Cart, Review) and a placeholder config inside `config/db.js` where you can pass your `MONGO_URI`.
- **Machine Learning**: Pre-computes TF-IDF term vectors from the CSV file (`/model/7817_1.csv`) and creates cosine-similarity distances, exposed via `/api/recommendations/:productId`.
- **Socket.io**: Real-time server-side setup within `server.js` and Order routes hook. Frontend setup with `socket.io-client`.

## Setup Steps

### 1. Database Hookup
Inside `/backend/.env`, pass your MongoDB Atlas cluster URI:
```
MONGO_URI=mongodb+srv://admin:pass@cluster.mongodb.net/shop
```
Until you configure this, the backend will intentionally log `Database connection placeholder called` and skip Mongoose connection, preventing crashes while allowing the ML part to spin up. The frontend pages also have dummy data fallbacks designed for demonstration!

### 2. Startup Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Startup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Request Flow Explained for Interview
1. **Frontend (React)**: User enters the website (e.g., `/products`). `useEffect` dispatches Axios GET requests to `/api/products` (debouncing search query parameters using our custom hook).
2. **Server Routing (Express)**: The Express Server instances map `/api/products` to `productRoutes`.
3. **Controller/Logic**: `productRoutes` invokes the `getProducts` controller function inside `productController.js`.
4. **Database (Mongoose)**: Inside the controller, Mongoose queries the MongoDB instance: `await Product.find({...keyword})`. If it fails, our error handler middleware intercepts it and returns a clean 500 error, which the React app uses to display a dummy fallback layout ensuring a robust UX.
5. **AI Recommender**: When viewing a product detail, the backend loads the `csv` dataset ONCE at startup and precomputes TF-IDF Vectors. By calling `/api/recommendations/:id`, the route accesses the precomputed vector for the viewed item, iterates through all 5000 other vectors using custom Dot-Product Math to compute Cosine Similarity, sorts them O(N log N), and returns the top 5!
