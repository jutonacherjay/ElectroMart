import { useState } from "react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setError("Demo mode - actual login would redirect");
    }, 3000);
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

          <div className="space-y-5">
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
                disabled={loading}
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
                disabled={loading}
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition transform relative overflow-hidden ${
                loading
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  {/* Animated Loader */}
                  <div className="relative w-6 h-6">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white opacity-80"
                      style={{animation: 'spin 1s linear infinite'}} />
                    
                    {/* Middle rotating ring (reverse) */}
                    <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-white border-l-white opacity-60"
                      style={{animation: 'spin 1.5s linear reverse infinite'}} />
                    
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-2 rounded-full bg-white opacity-30"
                      style={{animation: 'pulse 2s ease-in-out infinite'}} />
                  </div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Login as Admin"
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
              disabled={loading}
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}