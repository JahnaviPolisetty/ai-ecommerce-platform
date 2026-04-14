import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import ProductCard from '../components/ProductCard';
import { Star, ShoppingCart, ShieldCheck, Truck, ArrowLeft, Heart, Sparkles } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        
        // Fetch recommendations from ML endpoint
        axios.get(`/api/recommendations/${id}`).then(res => {
           setRecommendations(res.data);
        }).catch(() => setRecommendations([]));
        
      } catch (error) {
        // Fallback dummy UI mapped by ID
        const MOCK_PRODUCTS = [
          { _id: '1', name: 'Premium Wireless Headphones X1', category: 'Electronics', price: 299.99, rating: 4.8, numReviews: 120, countInStock: 5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', description: 'Experience pure acoustic bliss with our industry-leading noise cancellation technology. Designed for comfort and lasting durability.' },
          { _id: '2', name: 'Mechanical Keyboard Pro', category: 'Accessories', price: 149.50, rating: 4.9, numReviews: 85, countInStock: 12, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', description: 'Mechanical switches for the best tactile feedback. Customizable RGB lighting.' },
          { _id: '3', name: 'Ultra HD Smartwatch', category: 'Wearables', price: 199.00, rating: 4.6, numReviews: 240, countInStock: 3, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', description: 'Stay connected and track your health metrics effortlessly with our new smartwatch.' },
          { _id: '4', name: 'Ergonomic Office Chair', category: 'Furniture', price: 349.99, rating: 4.7, numReviews: 53, countInStock: 0, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80', description: 'Maximum comfort for long hours. Features adjustable lumbar support and breathability.' },
        ];
        const dummyProd = MOCK_PRODUCTS.find(p => p._id === id) || MOCK_PRODUCTS[0];
        setProduct({ ...dummyProd, _id: id });
        setRecommendations(MOCK_PRODUCTS.filter(p => p._id !== id));
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, product: product._id, qty }));
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center text-xl animate-pulse">Loading Product Data...</div>;

  return (
    <div className="space-y-16 animate-fade-in relative z-10 pb-16">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="card aspect-square overflow-hidden bg-white border border-gray-200 p-8 flex items-center justify-center relative group">
          <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-rose-50 hover:text-rose-500 transition-colors border border-gray-200 shadow-sm">
            <Heart className="w-6 h-6 text-gray-400 group-hover:text-rose-500" />
          </div>
          {product.image ? (
             <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500" />
          ) : (
             <span className="text-gray-400 text-2xl font-medium">Image Not Available</span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-900 ml-1">{product.rating}</span>
            </div>
            <span className="text-gray-500 font-medium hover:text-blue-600 cursor-pointer transition-colors">
              Read {product.numReviews || product.reviews} Reviews
            </span>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed pt-4 border-t border-gray-200">
            {product.description}
          </p>

          <div className="pt-6 relative">
            <div className="text-5xl font-black text-gray-900 mb-6">
              ${product.price}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Quantity:</span>
              <select 
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-24 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#ff9900] outline-none"
              >
                {[...Array(product.stock > 0 ? Math.min(product.stock, 10) : 10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-lg transition-all shadow-xl bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 text-white`}
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 mt-6">
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span className="font-medium text-sm">2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="w-6 h-6 text-blue-500" />
              <span className="font-medium text-sm">Free Express Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="pt-16 mt-16 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Customers Also Bought
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(simProd => (
              <ProductCard key={simProd._id} product={simProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
