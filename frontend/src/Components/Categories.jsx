import { useState, useEffect } from "react";
import axios from "axios";

const categories = [
  { id: 1, name: "Servo Motor", icon: "🛠️" },
  { id: 2, name: "Jumper Wire", icon: "🔌" },
  { id: 3, name: "Breadboard", icon: "📋" },
  { id: 4, name: "Arduino", icon: "💻" },
  { id: 5, name: "Raspberry Pi", icon: "🖥️" },
  { id: 6, name: "Microcontroller", icon: "⚡" },
  { id: 7, name: "Resistor", icon: "🔧" },
  { id: 8, name: "Capacitor", icon: "🔋" },
  { id: 9, name: "LED", icon: "💡" },
  { id: 10, name: "Sensor", icon: "📡" },
  { id: 11, name: "Potentiometer", icon: "🎛️" },
  { id: 12, name: "Transistor", icon: "🔹" },
  { id: 13, name: "Diode", icon: "🔸" },
  { id: 14, name: "Switch", icon: "⚙️" },
  { id: 15, name: "Battery", icon: "🔋" },
  { id: 16, name: "Motor Driver", icon: "🚗" },
  { id: 17, name: "Relay", icon: "🔄" },
  { id: 18, name: "Voltage Regulator", icon: "🔌" },
  { id: 19, name: "IC Chip", icon: "📀" },
  { id: 20, name: "Crystal Oscillator", icon: "⏱️" },
  { id: 21, name: "Buzzer", icon: "🎵" },
  { id: 22, name: "Stepper Motor", icon: "🌀" },
  { id: 23, name: "Heat Sink", icon: "❄️" },
  { id: 24, name: "USB Module", icon: "💾" },
  { id: 25, name: "WiFi Module", icon: "🌐" },
  { id: 26, name: "Bluetooth Module", icon: "📶" },
  { id: 27, name: "OLED Display", icon: "🖲️" },
  { id: 28, name: "LCD Display", icon: "🖥️" },
  { id: 29, name: "Joystick", icon: "🕹️" },
  { id: 30, name: "IR Sensor", icon: "📡" }
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const [wishlist, setWishlist] = useState([]);

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoading(true);
    
    try {
      const res = await axios.get(`https://electromart-backend-m2oz.onrender.com/api/products/category/${categoryName}`);
      setProducts(res.data);
      console.log('Products loaded:', res.data); // DEBUG
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setProducts([]);
    setAddedToCart({});
  };

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product); // DEBUG
    
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log('Current cart:', cart); // DEBUG
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingIndex > -1) {
      // Increase quantity
      cart[existingIndex].quantity += 1;
      console.log('Increased quantity'); // DEBUG
    } else {
      // Add new product
      cart.push({ ...product, quantity: 1 });
      console.log('Added new product'); // DEBUG
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log('Cart saved:', cart); // DEBUG
    
    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Show feedback
    setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
    
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  if (selectedCategory) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={handleBackToCategories}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </button>

        <h2 className="text-3xl font-bold mb-6">
          {categories.find(c => c.name === selectedCategory)?.icon} {selectedCategory}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {product.image ? (
                  <img 
                    src={`https://electromart-backend-m2oz.onrender.com${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-6xl">{categories.find(c => c.name === product.category)?.icon}</span>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">৳{product.price}</p>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-500">Contact Seller:</p>
                    {product.seller?.phone && (
                      <p className="text-sm font-semibold">📞 {product.seller.phone}</p>
                    )}
                    {product.seller?.email && (
                      <p className="text-sm font-semibold">📧 {product.seller.email}</p>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full mt-3 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${
                      addedToCart[product._id]
                        ? "bg-green-500 text-white"
                        : "text-white"
                    }`}
                    style={addedToCart[product._id] ? {} : {backgroundColor: '#00958f'}}
                  >
                    {addedToCart[product._id] ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600 mb-2">No products found in this category</p>
            <p className="text-gray-500">Be the first to add a product!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <span className="text-5xl">{category.icon}</span>
            <span className="font-semibold text-center text-sm">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}