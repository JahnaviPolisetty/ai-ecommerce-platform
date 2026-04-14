import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart size={72} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love to buy them later.</p>
        <Link to="/products">
          <button className="bg-[#ff9900] hover:bg-[#e88a00] text-black font-bold px-8 py-3 rounded-full text-lg transition-colors">
            Discover Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Wishlist <span className="text-gray-400 font-normal text-lg">({wishlist.length})</span>
        </h1>
        <button className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c7511f] border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50">
          <Share2 size={14} /> Share List
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((product) => {
          const discount = product.originalPrice > product.price
            ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
          return (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <Link to={`/product/${product.id}`}>
                <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/product/${product.id}`}>
                  <p className="text-sm font-medium text-gray-900 hover:text-[#c7511f] line-clamp-2 mb-1">{product.name}</p>
                </Link>
                <StarRating rating={product.rating} reviews={product.reviews} />
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  {discount > 0 && <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                </div>
                {product.prime && <p className="text-[#00a8e1] text-xs font-bold italic">prime FREE delivery</p>}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { addToCart(product); toast.success('Added to cart!', { icon: '🛒' }); }}
                    className="flex-1 bg-[#ff9900] hover:bg-[#e88a00] text-black text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-1 transition-colors">
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                  <button
                    onClick={() => { toggleWishlist(product); toast('Removed from wishlist', { icon: '🗑️' }); }}
                    className="w-9 h-9 border border-gray-300 hover:bg-red-50 hover:border-red-300 rounded-full flex items-center justify-center transition-colors">
                    <Trash2 size={14} className="text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
