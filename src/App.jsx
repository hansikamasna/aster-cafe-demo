import { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams, useLocation } from 'react-router-dom';
import { useCafe } from './store/CafeStore';


import CustomerHome from './pages/customer/Home';
import CustomerMenu from './pages/customer/Menu';
import CustomerCart from './pages/customer/Cart';
import CustomerBill from './pages/customer/Bill';
import CustomerSuccess from './pages/customer/Success';


import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminTables from './pages/admin/Tables';
import AdminBilling from './pages/admin/Billing';



import Loader from './components/Loader';
import BottomNav from './components/BottomNav';

export default function App() {
  const { tableNumber, setTableNumber, isAdmin } = useCafe();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

 
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const num = parseInt(tableParam, 10);
      if (num >= 1 && num <= 12) {
        setTableNumber(num);
      }
    }
  }, [searchParams, setTableNumber]);

  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <Routes>
        
        <Route path="/" element={<CustomerHome />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/cart" element={<CustomerCart />} />
        <Route path="/bill" element={<CustomerBill />} />
        <Route path="/success" element={<CustomerSuccess />} />

        
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/tables" element={<AdminTables />} />
        <Route path="/admin/billing" element={<AdminBilling />} />
        
      </Routes>

     
      {!isAdminRoute && tableNumber && <BottomNav />}
    </div>
  );
}
