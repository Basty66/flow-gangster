import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickCart from './components/QuickCart';
import Home from './views/Client/Home';
import ProductDetail from './views/Client/ProductDetail';
import Checkout from './views/Client/Checkout';
import Seguimiento from './views/Client/Seguimiento';
import Dashboard from './views/Admin/Dashboard';
import Inventory from './views/Admin/Inventory';
import Coupons from './views/Admin/Coupons';

export default function App() {
  return (
    <div className="min-h-screen bg-space-black flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/inventario" element={<Inventory />} />
          <Route path="/admin/cupones" element={<Coupons />} />
        </Routes>
      </main>
      <Footer />
      <QuickCart />
    </div>
  );
}
