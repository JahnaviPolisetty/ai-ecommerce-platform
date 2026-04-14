import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Zap, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

export default function ProductCard({ product, compact = false }) {
  const [imgError, setImgError] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name.substring(0, 30)}... added to cart`, {
      icon: '🛒',
      style: { background: '#232f3e', color: '#fff' },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: wishlisted ? '💔' : '❤️',
      style: { background: '#232f3e', color: '#fff' },
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col relative">
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: compact ? 160 : 200 }}>
          <img
            src={imgError ? `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}` : product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
          {discount > 0 && (
            <span className="absolute bottom-2 right-2 bg-[#cc0c39] text-white text-xs font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </p>

          <StarRating rating={product.rating} reviews={product.reviews} />

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Prime */}
          {product.prime && (
            <div className="flex items-center gap-1">
              <span className="text-[#00a8e1] font-bold text-xs italic">prime</span>
              <Package size={12} className="text-[#00a8e1]" />
              <span className="text-xs text-gray-500">FREE Delivery</span>
            </div>
          )}

          {/* Stock warning */}
          {product.stock <= 10 && (
            <p className="text-xs text-[#cc0c39] font-medium">
              Only {product.stock} left in stock!
            </p>
          )}

          {/* Add to Cart */}
          {!compact && (
            <button
              onClick={handleAddToCart}
              className="mt-auto w-full bg-[#ff9900] hover:bg-[#e88a00] text-black text-sm font-semibold py-2 rounded-full flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
