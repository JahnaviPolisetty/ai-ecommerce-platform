import express from 'express';
import { getRecommendations } from '../ml/recommender.js';

const router = express.Router();

// GET /api/recommendations/:productId
router.get('/:productId', (req, res) => {
  try {
    const productId = req.params.productId;
    const recommendations = getRecommendations(productId);
    
    // Return the response
    if (recommendations && recommendations.length > 0) {
      res.json(recommendations);
    } else {
      res.status(404).json({ message: 'No recommendations found for this product.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error generating recommendations' });
  }
});

export default router;
