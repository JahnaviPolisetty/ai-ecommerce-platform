import { Link, useNavigate } from 'react-router-dom';
import {
  User, Package, Heart, CreditCard, MapPin, Bell,
  Shield, LogOut, ChevronRight, Settings, Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';

const MENU_SECTIONS = [
  {
    title: 'Your Account',
    items: [
      { icon: Package, label: 'Your Orders', sub: 'Track, return or buy again', to: '/orders', color: 'bg-blue-100 text-blue-700' },
      { icon: Heart, label: 'Wishlist', sub: 'Manage saved items', to: '/wishlist', color: 'bg-red-100 text-red-700' },
      { icon: Sparkles, label: 'AI Picks', sub: 'Personalized recommendations', to: '/ai-picks', color: 'bg-orange-100 text-orange-700' },
    ],
  },
  {
    title: 'Payment & Security',
    items: [
      { icon: CreditCard, label: 'Payment Methods', sub: 'Manage cards & Amazon Pay', to: '#', color: 'bg-green-100 text-green-700' },
      { icon: MapPin, label: 'Addresses', sub: 'Manage shipping addresses', to: '#', color: 'bg-purple-100 text-purple-700' },
      { icon: Shield, label: 'Login & Security', sub: 'Password, 2FA, connected apps', to: '#', color: 'bg-gray-100 text-gray-700' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', sub: 'Email, push and SMS alerts', to: '#', color: 'bg-yellow-100 text-yellow-700' },
      { icon: Settings, label: 'Account Settings', sub: 'Privacy, communications', to: '#', color: 'bg-indigo-100 text-indigo-700' },
    ],
  },
];

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, orders, wishlist, cart } = useStore();

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User size={60} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to your account</h2>
        <p className="text-gray-500 mb-6 text-sm">Access orders, wishlist, and personalized recommendations</p>
        <Link to="/login">
          <button className="bg-[#ff9900] hover:bg-[#e88a00] text-black font-bold px-8 py-2.5 rounded-full">Sign In</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#131921] to-[#232f3e] rounded-2xl p-6 mb-8 text-white flex items-center gap-5">
        <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center text-2xl font-black text-black">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-[#ff9900]">{orders.length} Orders</span>
            <span className="text-gray-400">·</span>
            <span className="text-[#ff9900]">{wishlist.length} Saved</span>
            <span className="text-gray-400">·</span>
            <span className="text-[#ff9900]">{cart.length} In Cart</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length || 2, icon: Package, color: 'text-blue-600' },
          { label: 'Saved Items', value: wishlist.length, icon: Heart, color: 'text-red-600' },
          { label: 'Cart Items', value: cart.reduce((s, i) => s + i.quantity, 0), icon: Package, color: 'text-orange-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <Icon size={24} className={`mx-auto mb-1 ${color}`} />
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Menu Sections */}
      {MENU_SECTIONS.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {section.items.map(({ icon: Icon, label, sub, to, color }) => (
              <Link key={label} to={to}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-3 group cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-[#c7511f]">{label}</p>
                    <p className="text-xs text-gray-500 truncate">{sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-700 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Sign Out */}
      <button
        onClick={() => { logout(); navigate('/'); }}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-red-50 hover:border-red-300 text-gray-700 hover:text-red-600 font-medium py-3 rounded-xl transition-colors mt-4"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
