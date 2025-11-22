import { useState } from "react";
import axios from "axios";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const response = await axios.post(url, formData);

      if (isSignup) {
        setMessage("Signup successful! Please login.");
        setIsSignup(false);
        resetForm();
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.reload();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred!");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden px-4">

      {/* 🔧 MOVING ELECTRONICS BACKGROUND ICONS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          "🔌", "🤖", "🛠️", "🔋", "📟", "💡",
          "🧰", "⚙️", "📡", "🔧", "🧲", "🧪",
          "🖥️", "🎛️", "🔭", "🪛"
        ].map((icon, i) => (
          <span
            key={i}
            className="absolute text-4xl animate-float opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      {/* 🔥 AUTH CARD */}
      <div
        className="
          max-w-md w-full bg-white p-8 rounded-2xl shadow-xl
          relative z-10
          transform transition-all duration-500
          animate-fadeIn
        "
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">

          {isSignup && (
            <div className="relative">
              <label className="text-sm text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                autoComplete="off"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-b-2 p-2 outline-none focus:border-pink-500"
              />
            </div>
          )}

          <div className="relative">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b-2 p-2 outline-none focus:border-pink-500"
            />
          </div>

          <div className="relative">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-b-2 p-2 outline-none focus:border-pink-500"
            />
          </div>

          <button
            type="submit"
            className="
              w-full bg-[#a64d79] text-white p-3 rounded-xl font-semibold
              transform transition duration-300
              hover:scale-105 hover:shadow-lg active:scale-95
            "
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-5">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-[#a64d79] font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setIsSignup(!isSignup);
              resetForm();
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>

      {/* 🔥 FLOAT ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>

    </div>
  );
}
