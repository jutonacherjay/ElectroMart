import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      
      if (token) {
        try {
          const res = await axios.get("https://electromart-backend-m2oz.onrender.com/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = res.data;
          localStorage.setItem("user", JSON.stringify(userData));
          
          setUser(userData);
          setEditForm({
            name: userData?.name || "",
            email: userData?.email || "",
            phone: userData?.phone || "",
          });
          setImagePreview(userData?.profileImage ? `https://electromart-backend-m2oz.onrender.com${userData.profileImage}` : null);

          const productsRes = await axios.get("https://electromart-backend-m2oz.onrender.com/api/products/my-products", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProducts(productsRes.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUser(storedUser);
          setEditForm({
            name: storedUser?.name || "",
            email: storedUser?.email || "",
            phone: storedUser?.phone || "",
          });
          setImagePreview(storedUser?.profileImage || null);
          
          const userProducts = JSON.parse(localStorage.getItem("products")) || [];
          setProducts(userProducts);
        }
      } else {
        setUser(storedUser);
        setEditForm({
          name: storedUser?.name || "",
          email: storedUser?.email || "",
          phone: storedUser?.phone || "",
        });
        setImagePreview(storedUser?.profileImage || null);
        
        const userProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(userProducts);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setMessage("Please login first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      try {
        const res = await axios.put(
          "https://electromart-backend-m2oz.onrender.com/api/profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        const updatedUser = { 
          ...user, 
          ...editForm, 
          profileImage: res.data.user.profileImage 
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setImagePreview(res.data.user.profileImage ? `https://electromart-backend-m2oz.onrender.com${res.data.user.profileImage}` : null);
      } catch (backendError) {
        console.log("Backend error:", backendError);
        const updatedUser = { ...user, ...editForm, profileImage: imagePreview };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      setMessage("Profile updated successfully!");
      
      window.dispatchEvent(new Event("userUpdated"));
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error updating profile");
    }
  };

  if (!user) return <p className="p-4 md:p-6 text-center">Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">My Profile</h2>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div style={{background: 'linear-gradient(to bottom right, #76F06A, #5dd151)'}} className="p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-green-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow w-full sm:flex-1">
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-3 text-xs sm:text-sm bg-white rounded px-2 py-1 w-full"
                />
              )}

              {!isEditing ? (
                <>
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-green-800 font-semibold">Name</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 break-words">{user.name}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-green-800 font-semibold">Email</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 break-all">{user.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-green-800 font-semibold">Phone</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{user.phone || "Not provided"}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2 rounded-lg transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="block text-xs sm:text-sm text-green-900 font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full border-2 border-white bg-white/90 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs sm:text-sm text-green-900 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full border-2 border-white bg-white/90 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm text-green-900 font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="w-full border-2 border-white bg-white/90 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <button
                      onClick={handleUpdateProfile}
                      className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2 rounded-lg transition font-semibold shadow-lg hover:shadow-xl text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                        });
                        setImagePreview(user.profileImage || null);
                        setProfileImage(null);
                      }}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg transition font-semibold shadow-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sell Products Card */}
        <div style={{background: 'linear-gradient(to bottom right, #148F6D, #0a6b50)'}} className="p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-green-300">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Sell Your Products</h3>
          <p className="text-sm sm:text-base text-green-50 mb-3 sm:mb-4">
            Have something to sell? Add your products and reach thousands of buyers!
          </p>
          <Link
            to="/add-product"
            className="inline-block w-full sm:w-auto text-center bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            + Add Product for Sale
          </Link>
        </div>

        {/* My Products Card */}
        <div style={{ background: 'linear-gradient(to bottom right, #FF8A8A, #ff6b6b)' }} className="p-4 sm:p-6 rounded-lg shadow-md border border-red-300">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">My Products</h3>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {products.map((p) => (
                <div key={p._id} className="border border-gray-200 p-3 sm:p-4 rounded-lg hover:shadow-lg transition bg-white">
                  {p.image && (
                    <img 
                      src={`https://electromart-backend-m2oz.onrender.com${p.image}`} 
                      alt={p.name}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-2 sm:mb-3"
                    />
                  )}
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">{p.name}</h4>
                  <p className="text-blue-600 font-bold text-sm sm:text-base mt-1">৳{p.price}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">📦 {p.category}</p>
                  {p.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No products added yet</p>
              <Link
                to="/add-product"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
              >
                Add your first product →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}