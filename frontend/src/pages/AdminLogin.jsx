import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://electromart-backend-m2oz.onrender.com/api/admin/login", form);
      
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background: 'linear-gradient(to bottom right, #00958f, #00b193)'}}>
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/80">ElectroMart Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@electromart.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Default Credentials: <br />
              {/* <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin@electromart.com</span>
              <br />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span> */}
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}