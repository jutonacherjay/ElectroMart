import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Categories from "./Components/Categories";
import ProfilePage from "./pages/ProfilePage";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  
  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Show user navbar only if user is logged in AND not on admin routes */}
      {user && !isAdminRoute && <Navbar />}
      
      <Routes>
        {/* Admin Routes - accessible without user login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* User Routes */}
        {!user && <Route path="*" element={<AuthPage />} />}
        {user && (
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