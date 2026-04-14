import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Routes imports
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import recommenderRoutes from './routes/recommenderRoutes.js';
import { initRecommender } from './ml/recommender.js';

dotenv.config();

// DB Connection
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

// Real-time middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// APIs
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/recommendations', recommenderRoutes);

app.get('/', (req, res) => res.send('API is running...'));

// Initialize ML model
initRecommender().then(() => {
  console.log('Recommender module loaded.');
}).catch(err => {
  console.error('Failed to load recommender:', err);
});

// Socket connection
io.on('connection', (socket) => {
  console.log('socket client connected: ', socket.id);
  socket.on('disconnect', () => {
    console.log('socket client disconnected: ', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
