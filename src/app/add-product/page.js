"use client";

import { useState } from "react";
import Image from "next/image";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    price: 0, // 👈 keep as number from start
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value, // 👈 convert price to number
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please provide an image (upload or URL).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // 👈 price is already number
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");

      alert("✅ Product added successfully!");
      setForm({ name: "", price: 0, category: "", image: "" });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-2xl text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        ➕ Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (PKR)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Image Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Image <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg mb-3 hover:border-green-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-sm"
            />

            {uploading && (
              <div className="mt-2 h-20 w-full bg-gray-200 animate-pulse rounded-lg"></div>
            )}
          </div>

          {/* OR Divider */}
          <p className="text-center text-sm text-gray-500 my-2">— or —</p>

          {/* URL Input */}
          <input
            type="url"
            name="image"
            value={form.image.startsWith("http") ? form.image : ""}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Preview */}
          {form.image && !uploading && (
            <div className="relative mt-3 w-28 h-28 border rounded-lg overflow-hidden">
              <Image
                src={form.image}
                alt="Product Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </span>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
}
