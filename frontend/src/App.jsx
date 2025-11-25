import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Categories from "./Components/Categories";
import AuthPage from "./pages/AuthPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <>
      {user && !isAdminRoute && <Navbar />}
      
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* User Routes */}
        {user ? (
          <>
            <Route
              path="/"
              element={
                <div>
                  <Hero />
                  <Categories />
                </div>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist-page" element={<WishlistPage/>} />
            <Route path="/seller-dashboard" element={<SellerDashboard/>} />
          </>
        ) : (
          <Route path="*" element={<AuthPage />} />
        )}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;