"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ new loading state
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching admin/user from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    } else {
      setLoading(false); // done checking
    }
  }, [router]);

  // Static credentials
  const userCred = "@salman";
  const userpass = "12345678";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === userCred && password === userpass) {
      localStorage.setItem("user", username);
      router.push("/");
    } else {
      setError("❌ Invalid credentials");
    }
  };

  // ✅ Show loader while checking admin
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <section className="min-h-[85vh] flex items-center justify-center text-gray-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          🔐 Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="user" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="user"
              name="user"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setuserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
