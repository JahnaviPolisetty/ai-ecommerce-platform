# Machine Learning Walkthrough

This document outlines the powerful, native Machine Learning architecture powering your E-Commerce recommendation engine right inside Node.js, eliminating the need for bulky Python microservices.

## 1. The ML Engine Core ([backend/ml/recommender.js](file:///e:/E-Commerce%20Website/backend/ml/recommender.js))

At the heart of the recommendation system is a lightweight **Natural Language Processing (NLP)** engine built using the `natural` library. It operates entirely on your backend without external API dependencies.

### TF-IDF Vectorization
When the backend boots up ([server.js](file:///e:/E-Commerce%20Website/backend/server.js)), it immediately triggers [initRecommender()](file:///e:/E-Commerce%20Website/backend/ml/recommender.js#17-67). This function:
1. **Reads the Dataset**: Securely streams the CSV dataset containing Amazon product metadata (names, descriptions).
2. **Text Preprocessing**: It extracts the `product_name` and `about_product` fields, lowercases them, and strips out special characters to ensure clean data computation.
3. **TF-IDF Computation**: It feeds the sanitized text into a **Term Frequency-Inverse Document Frequency (TF-IDF)** module. TF-IDF evaluates how important a word is to a specific product description compared to the entire product catalog, filtering out generic words and emphasizing unique keywords.
4. **Vector Storage**: The engine mathematical weights for each product and caches them into high-speed memory (`docVectors`). 

### Cosine Similarity Engine
When a recommendation is requested via [getRecommendations(targetProductId)](file:///e:/E-Commerce%20Website/backend/ml/recommender.js#87-110), the engine mathematically compares the target product's TF-IDF vector against all other product vectors using **Cosine Similarity**:
- **Dot Product**: It calculates the directional overlap between the mathematical representation of the product descriptions.
- **Scoring**: A score closer to `1` means the products are highly relevant and share significant thematic keywords.
- **Ranking**: The algorithm instantly sorts the entire catalog and returns the **Top 5** closest matches.

---

## 2. The Backend Bridge ([backend/routes/recommenderRoutes.js](file:///e:/E-Commerce%20Website/backend/routes/recommenderRoutes.js))

The complex math running in [recommender.js](file:///e:/E-Commerce%20Website/backend/ml/recommender.js) is securely exposed to the internet via an Express Route:
- **Endpoint**: `GET /api/recommendations/:productId`
- **Execution**: Whenever a user hits this endpoint, the backend swiftly retrieves the top 5 similar items using the cached Cosine Similarity scores.
- **Response**: The backend outputs the raw JSON objects to the network payload.

---

## 3. The Frontend Connect ([frontend/src/pages/ProductDetails.jsx](file:///e:/E-Commerce%20Website/frontend/src/pages/ProductDetails.jsx))

Your beautiful AuraShop UI gracefully maps the ML pipeline into a premium user experience:
1. **Component Mount**: The moment a user clicks on a product and [ProductDetails.jsx](file:///e:/E-Commerce%20Website/frontend/src/pages/ProductDetails.jsx) renders, the `useEffect` hook fires an asynchronous `axios.get` request directly to your ML backend (`/api/recommendations/${id}`).
2. **State Management**: The top 5 identical products are safely parsed and stored in the local React `recommendations` state.
3. **Dynamic Presentation**: Below the main product, the UI dynamically renders the **"Customers Also Bought"** section featuring those highly relevant, AI-curated products to maximize conversion rates.

This pipeline ensures sub-second native machine learning querying with zero external API calls or latency delays!
