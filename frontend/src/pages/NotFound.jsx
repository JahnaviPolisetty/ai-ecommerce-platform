import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in relative z-10 text-center space-y-6">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
          404
        </h1>
        <p className="text-2xl font-medium text-slate-300">Whoops! That page doesn't exist.</p>
        <Link to="/" className="btn-primary mt-4 py-3 px-8 text-lg">
          Take Me Home
        </Link>
    </div>
  );
};

export default NotFound;
