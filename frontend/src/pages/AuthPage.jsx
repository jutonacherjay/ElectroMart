import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 NEW

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); // 🔥 Show loading on Login

    try {
      const url = isSignup
        ? "https://electromart-backend-m2oz.onrender.com/api/auth/signup"
        : "https://electromart-backend-m2oz.onrender.com/api/auth/login";

      const response = await axios.post(url, formData);

      if (isSignup) {
        // 🔥 Sweet success alert
        alert("🎉 Signup Successful! Please Login.");

        setIsSignup(false);
        resetForm();
      } else {
        // login success
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // reload page after login
        window.location.reload();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false); // 🔥 stop loading
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white px-4">

      {/* Background Icons */} 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          "🔌","🤖","🛠️","🔋","📟","💡",
          "🧰","⚙️","📡","🔧","🧲","🧪",
          "🖥️","🎛️","🔭","🪛"
        ].map((icon, i) => (
          <span key={i} className="absolute text-4xl animate-float opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}>
            {icon}
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl relative z-10 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">

          {isSignup && (
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-b-2 p-2 focus:border-pink-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b-2 p-2 focus:border-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-b-2 p-2 focus:border-pink-500 outline-none"
            />
          </div>

          {/* 🔥 Button with loading state */}
          <button
            type="submit"
            className="w-full bg-[#a64d79] text-white p-3 rounded-xl font-semibold 
                       hover:scale-105 transition duration-300 active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </span>
            ) : (
              isSignup ? "Sign Up" : "Login"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-5">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="text-[#a64d79] cursor-pointer hover:underline"
            onClick={() => {
              setIsSignup(!isSignup);
              resetForm();
            }}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

        <div className="mt-6 pt-4 text-center border-t border-gray-300">
          <Link to="/admin/login" className="text-sm text-[#a64d79] hover:underline font-semibold">
            Login as Admin
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn .8s ease-out;
        }
      `}</style>

    </div>
  );
}
