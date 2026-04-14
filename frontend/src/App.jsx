import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Shipping from './pages/Shipping';
import NotFound from './pages/NotFound';
import Wishlist from './pages/Wishlist';
import Deals from './pages/Deals';
import Orders from './pages/Orders';
import AIRecommendations from './pages/AIRecommendations';
import Account from './pages/Account';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-50">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-8 relative z-10 w-full max-w-[1500px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/ai-picks" element={<AIRecommendations />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
