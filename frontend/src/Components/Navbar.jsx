import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Load cart count
    const updateCartCount = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        setCartCount(0);
        return;
      }
      
      const cartKey = `cart_${user.email}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    // Load wishlist count
    const updateWishlistCount = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        setWishlistCount(0);
        return;
      }
      
      const wishlistKey = `wishlist_${user.email}`;
      const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      setWishlistCount(wishlist.length);
    };

    updateCartCount();
    updateWishlistCount();

    // Listen for updates
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
      updateCartCount();
      updateWishlistCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleStorageChange);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav style={{background: 'linear-gradient(to right, #00958f, #00b193)'}} className="text-white px-6 py-4 flex items-center justify-between shadow-xl">
      <Link to="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition flex items-center gap-2">
        <span className="text-3xl">⚡</span>
        ElectroMart
      </Link>

      <div className="flex items-center gap-6">
        {user && (
          <>
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative hover:bg-white/20 p-2 rounded-lg transition">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:bg-white/20 p-2 rounded-lg transition">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="flex items-center gap-3 hover:bg-white/20 px-4 py-2 rounded-lg transition backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage.startsWith('http') ? user.profileImage : `https://electromart-backend-m2oz.onrender.com${user.profileImage}`} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <span className="font-semibold text-white hover:text-yellow-300 transition">
                {user.name}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}