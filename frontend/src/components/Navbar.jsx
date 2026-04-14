import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search, ShoppingCart, Menu, MapPin, ChevronDown,
  User, Heart, Package, LogOut, Sparkles, Bell, X, Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/products';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const { searchHistory, addSearchHistory } = useStore();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const cartCount = cartItems ? cartItems.reduce((s, i) => s + (i.qty || 1), 0) : 0;
  const isLoggedIn = !!userInfo;
  const user = userInfo;

  const notifications = [
    { id: 1, text: 'Your order #AMZ-123 has shipped!', time: '2h ago', unread: true },
    { id: 2, text: 'Price drop on Sony Headphones', time: '5h ago', unread: true },
    { id: 3, text: 'Flash sale: 40% off Electronics today', time: '1d ago', unread: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addSearchHistory(query.trim());
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#131921] text-white shadow-lg">
      {/* Main Navbar */}
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 mr-4 shrink-0">
          <Zap className="w-6 h-6 text-[#ff9900]" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#ff9900] to-yellow-300 bg-clip-text text-transparent">AuraShop</span>
        </Link>

        {/* Delivery */}
        <Link to="/shipping" className="hidden lg:flex flex-col text-xs cursor-pointer hover:ring-1 hover:ring-white rounded px-1 py-1 shrink-0">
          <span className="text-gray-400">Deliver to</span>
          <div className="flex items-center gap-1 font-bold text-sm">
            <MapPin size={14} />
            <span>Select Address</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex" ref={searchRef}>
          <div className="relative flex w-full rounded-lg overflow-hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-200 text-gray-800 text-xs px-2 border-r border-gray-300 outline-none cursor-pointer hidden md:block min-w-[80px]"
            >
              <option>All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search products, brands and more..."
                className="w-full px-4 py-2.5 text-gray-900 text-sm outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
              {/* Search Dropdown */}
              {showDropdown && searchHistory.length > 0 && !query && (
                <div className="absolute top-full left-0 right-0 bg-white text-gray-900 shadow-2xl z-50 rounded-b-lg border border-gray-200">
                  <div className="px-4 py-2 text-xs text-gray-500 font-semibold border-b">Recent Searches</div>
                  {searchHistory.slice(0, 6).map((h, i) => (
                    <button
                      key={i}
                      onClick={() => { setQuery(h); setShowDropdown(false); navigate(`/products?keyword=${encodeURIComponent(h)}`); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                    >
                      <Search size={12} className="text-gray-400" />
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#ff9900] hover:bg-[#e88a00] px-4 flex items-center transition-colors"
            >
              <Search size={20} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex flex-col items-center px-2 py-1 hover:ring-1 hover:ring-white rounded text-xs"
            >
              <div className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-[#ff9900] text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
              </div>
              <span className="hidden md:block mt-0.5">Alerts</span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white text-gray-900 shadow-2xl rounded-lg border border-gray-200 z-50">
                <div className="px-4 py-3 border-b font-semibold flex justify-between">
                  <span>Notifications</span>
                  <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-blue-50' : ''}`}>
                    <p className="text-sm">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex flex-col px-2 py-1 hover:ring-1 hover:ring-white rounded text-xs"
            >
              <span className="text-gray-300">Hello, {isLoggedIn ? (user?.name || user?.email?.split('@')[0]) : 'Sign in'}</span>
              <div className="flex items-center gap-1 font-bold text-sm">
                <span>Account</span>
                <ChevronDown size={12} />
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white text-gray-900 shadow-2xl rounded-lg border border-gray-200 z-50">
                {!isLoggedIn ? (
                  <div className="p-4 border-b">
                    <Link to="/login" onClick={() => setShowUserMenu(false)}>
                      <button className="w-full bg-[#ff9900] hover:bg-[#e88a00] text-black font-bold py-2 rounded-lg text-sm">
                        Sign In
                      </button>
                    </Link>
                    <p className="text-xs text-center mt-2">
                      New customer? <Link to="/register" className="text-blue-600 hover:underline" onClick={() => setShowUserMenu(false)}>Start here</Link>
                    </p>
                  </div>
                ) : (
                  <div className="p-3 border-b bg-gray-50">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                )}
                <div className="py-2">
                  {[
                    { icon: User, label: 'Your Account', to: '/account' },
                    { icon: Package, label: 'Your Orders', to: '/orders' },
                    { icon: Heart, label: 'Wishlist', to: '/wishlist' },
                    { icon: Sparkles, label: 'AI Recommendations', to: '/ai-picks' },
                  ].map(({ icon: Icon, label, to }) => (
                    <Link key={to} to={to} onClick={() => setShowUserMenu(false)}>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-3">
                        <Icon size={16} className="text-gray-500" />
                        {label}
                      </button>
                    </Link>
                  ))}
                  {isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-3 text-red-600 border-t mt-1"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart">
            <button className="relative flex items-center gap-1 px-2 py-1 hover:ring-1 hover:ring-white rounded">
              <div className="relative">
                <ShoppingCart size={28} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-[#ff9900] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm hidden md:inline">Cart</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-[#232f3e] text-sm">
        <div className="flex items-center px-4 gap-1 overflow-x-auto scrollbar-hide">
          <Link to="/products">
            <button className="flex items-center gap-1 px-3 py-2 hover:ring-1 hover:ring-white rounded whitespace-nowrap">
              <Menu size={16} />
              All Categories
            </button>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`}>
              <button className="px-3 py-2 hover:ring-1 hover:ring-white rounded whitespace-nowrap">
                {cat.name}
              </button>
            </Link>
          ))}
          <Link to="/ai-picks">
            <button className="px-3 py-2 hover:ring-1 hover:ring-white rounded whitespace-nowrap flex items-center gap-1 text-[#ff9900]">
              <Sparkles size={14} />
              AI Picks
            </button>
          </Link>
          <Link to="/deals">
            <button className="px-3 py-2 hover:ring-1 hover:ring-white rounded whitespace-nowrap text-[#ff9900]">
              Today's Deals
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
