import Order from '../models/Order.js';

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems, user: req.user._id, shippingAddress, paymentMethod, totalPrice
    });
    
    if (req.io) {
        req.io.emit('orderStatusChanged', { orderId: order._id, status: 'placed' });
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'DB Error (Order Create)' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'DB Error (Orders)' });
  }
};
