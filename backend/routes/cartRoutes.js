import express from 'express';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    res.json(cart || { cartItems: [] });
  } catch (error) {
     res.status(500).json({ message: 'Cart fetch error' });
  }
}).post(protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: req.body.cartItems });
    } else {
      cart.cartItems = req.body.cartItems;
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (e) {
    res.status(500).json({ message: 'Cart update error' });
  }
});

export default router;
