import { Link } from 'react-router-dom';

const Shipping = () => {
  return (
    <div className="max-w-2xl mx-auto py-20 animate-fade-in relative z-10">
      <div className="card p-10 text-center space-y-6 bg-slate-900 border border-slate-800">
        <h2 className="text-4xl font-extrabold text-white">Shipping Details</h2>
        <p className="text-lg text-slate-400">
          This is a demonstration mockup. The payment gateway and order finalization steps are purposefully not fully wired yet to avoid real transactions during testing.
        </p>
        <Link to="/products" className="btn-primary mt-8 inline-flex items-center gap-2 text-lg px-8 py-4">
          Return to Catalog
        </Link>
      </div>
    </div>
  );
};

export default Shipping;
