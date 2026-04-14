import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10 pt-8">
      <h1 className="text-4xl font-bold">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="card p-12 text-center space-y-4 border-dashed border-2 border-slate-700 bg-slate-900/50">
          <p className="text-2xl text-slate-400">Your cart is strikingly empty.</p>
          <Link to="/products" className="inline-block btn-primary">Go Back & Shop</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="card p-4 flex flex-col sm:flex-row items-center gap-6">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.product}`} className="font-bold text-lg hover:text-blue-400 transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="font-bold text-blue-400 text-xl mt-1">${item.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={item.qty} 
                    onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                    className="input-field w-20 py-2"
                  >
                    {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => dispatch(removeFromCart(item.product))}
                    className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6 h-fit bg-slate-800/80 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-700">Order Summary</h2>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span className="text-slate-400">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span className="font-bold">${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium pb-4 border-b border-slate-700">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-white pt-2">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button 
              onClick={checkoutHandler} 
              className="w-full btn-primary mt-8 flex items-center justify-center gap-2 py-4 text-lg"
            >
              Proceed To Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
