"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaBox, FaTimes, FaImage, FaDollarSign, FaTag } from "react-icons/fa";

export default function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(product || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: Number(product.price) || 0,
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/update-product/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      toast.success("Product updated successfully!");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBox className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-6 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <FaBox size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Product</h2>
                  <p className="text-green-100 text-sm mt-0.5">Update product information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                disabled={loading}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Form */}
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              
              {/* Product Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaBox className="text-green-600" size={14} />
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaDollarSign className="text-green-600" size={14} />
                  Price (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaTag className="text-green-600" size={14} />
                  Category
                </label>
                <input
                  name="category"
                  value={form.category || ""}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Clothing"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800"
                  required
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaImage className="text-green-600" size={14} />
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800"
                  required
                />

                {/* Image Preview */}
                {form.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 relative"
                  >
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg group">
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
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}