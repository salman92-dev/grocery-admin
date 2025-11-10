"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBox, FaDollarSign, FaTag, FaImage, FaArrowLeft, FaUpload, FaCheck } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", price: 0, category: "", image: "" });

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) router.push("/login"); else setUserLoading(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "price" ? Number(value) : value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload-image", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Upload failed");
      setForm((p) => ({ ...p, image: d.url }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error('Please provide an image.');
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to add product");
      
      toast.success('Product added successfully!');
      setTimeout(() => router.push('/products'), 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Products
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
              <FaBox size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-1">
                Add New Product
              </h1>
              <p className="text-sm text-gray-600">Fill in the details to add a new product to your store</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Product Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaBox className="text-purple-600" size={18} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Information</h2>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaBox className="text-purple-600" size={14} />
                Product Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter product name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-800"
                required 
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaDollarSign className="text-purple-600" size={14} />
                Price (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  Rs.
                </span>
                <input 
                  type="number" 
                  name="price" 
                  value={form.price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-800"
                  required 
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaTag className="text-purple-600" size={14} />
                Category
              </label>
              <input 
                type="text" 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                placeholder="e.g., Electronics, Clothing, Food"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-800"
                required 
              />
            </div>
          </motion.section>

          {/* Media Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaImage className="text-purple-600" size={18} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-purple-50/30 hover:from-gray-100 hover:to-purple-100/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow mb-3">
                    <FaUpload className="text-purple-600" size={24} />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    <span className="text-purple-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {uploading && (
                <div className="flex items-center justify-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-purple-700">Uploading image...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Image URL
              </label>
              <input 
                type="url" 
                name="image" 
                value={form.image.startsWith("http") ? form.image : ""} 
                onChange={handleChange} 
                placeholder="https://example.com/image.png"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-800"
              />
            </div>

            {/* Image Preview */}
            {form.image && !uploading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheck className="text-green-600" size={12} />
                  </div>
                  <span className="text-sm font-semibold text-green-700">Image ready</span>
                </div>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg group">
                  <Image 
                    src={form.image} 
                    alt="Preview" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-medium">Product Preview</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pt-4"
          >
            <button 
              type="submit" 
              disabled={loading || uploading || !form.image}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <FaCheck /> Add Product
                </>
              )}
            </button>
          </motion.div>

        </form>
      </div>
    </div>
  );
}