import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  
  const redirect = new URLSearchParams(search).get('redirect') ? new URLSearchParams(search).get('redirect') : '/';
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Mocked if no backend connection
      const { data } = await axios.post('/api/users/login', { email, password }).catch(() => ({ 
        data: { _id: 'dummy', name: 'Demo User', email, token: 'fake-jwt', isAdmin: false } 
      }));
      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (err) {
      setError('Invalid credentials supplied or database is disconnected.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in relative z-10 px-4">
      <div className="card w-full max-w-md p-8 md:p-10 space-y-8 bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/30 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-2 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access your premium account</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl text-center font-medium alert">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6 relative z-10">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12 py-3 bg-slate-950 border-slate-800 focus:border-blue-500 text-white w-full"
                required
              />
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 py-3 bg-slate-950 border-slate-800 focus:border-blue-500 text-white w-full"
                required
              />
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3.5 text-lg flex items-center justify-center gap-2 group">
            Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center text-slate-400 text-sm relative z-10">
          Don't have an account?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
