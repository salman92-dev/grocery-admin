"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  // Static credentials
  const userCred = "@salman";
  const userpass = "12345678";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === userCred && password === userpass) {
      localStorage.setItem("user", username);
      router.push("/");
    } else {
      setError("Invalid credentials. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50/30 px-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4"
            >
              <FaShieldAlt size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-green-100 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-2"
            >
              <label htmlFor="user" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUser className="text-green-600" size={14} />
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaUser size={18} />
                </div>
                <input
                  type="text"
                  id="user"
                  name="user"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setuserName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaLock className="text-green-600" size={14} />
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <p className="text-red-600 text-sm text-center font-semibold flex items-center justify-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>

      </motion.div>
    </section>
  );
};

export default Login;