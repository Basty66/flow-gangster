import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickCart from './components/QuickCart';
import AdminLogin from './components/AdminLogin';
import Home from './views/Client/Home';
import ProductDetail from './views/Client/ProductDetail';
import Checkout from './views/Client/Checkout';
import Seguimiento from './views/Client/Seguimiento';
import Dashboard from './views/Admin/Dashboard';
import Inventory from './views/Admin/Inventory';
import Coupons from './views/Admin/Coupons';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return children;
}

export default function App() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const n = logoClicks + 1;
    setLogoClicks(n);
    if (n >= 7) {
      setLogoClicks(0);
      setShowLogin(true);
    }
    setTimeout(() => setLogoClicks((c) => Math.max(0, c - 1)), 3000);
  };

  return (
    <div className="min-h-screen bg-deep flex flex-col">
      <Navbar onLogoClick={handleLogoClick} />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home onLogoClick={handleLogoClick} />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/inventario" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/admin/cupones" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
      <Footer />
      <QuickCart />
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
    </div>
  );
}
