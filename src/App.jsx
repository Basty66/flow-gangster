import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickCart from './components/QuickCart';
import PageTransition from './components/PageTransition';
import Home from './views/Client/Home';
import ProductDetail from './views/Client/ProductDetail';
import Checkout from './views/Client/Checkout';
import Seguimiento from './views/Client/Seguimiento';
import AdminDashboard from './views/Admin/Dashboard';
import AdminInventory from './views/Admin/Inventory';
import AdminLayout from './views/Admin/AdminLayout';

let clickCount = 0;
let clickTimer = null;

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogoClick = () => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
    if (clickCount >= 5) {
      clickCount = 0;
      window.dispatchEvent(new CustomEvent('open-admin-login'));
    }
  };

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inventario" element={<AdminInventory />} />
        </Route>
      </Routes>
    );
  }

  return (
    <>
      <Navbar onLogoClick={handleLogoClick} />
      <main className="min-h-screen">
        <PageTransition locationKey={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <QuickCart />
    </>
  );
}

export default function App() {
  return <AppContent />;
}
