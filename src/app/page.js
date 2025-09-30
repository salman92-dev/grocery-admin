"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import EditProductModal from "./components/update-product";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // ✅ track delete in progress

  // fetch products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fetch-data", { cache: "no-store" });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // delete product with toast confirm + loader
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-2">
          <p className="font-medium text-gray-800">
            Are you sure you want to delete this product?
          </p>
          <div className="flex space-x-2">
            <button
              disabled={deletingId === id}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              onClick={async () => {
                setDeletingId(id); // ✅ start loader
                toast.dismiss(t.id);

                try {
                  const res = await fetch(`/api/delete-product/${id}`, {
                    method: "DELETE",
                  });
                  if (res.ok) {
                    setProducts((prev) => prev.filter((p) => p.id !== id));
                    toast.success("Product deleted successfully!");
                  } else {
                    toast.error("Failed to delete product.");
                  }
                } catch (err) {
                  toast.error("Error deleting product.");
                } finally {
                  setDeletingId(null); // ✅ stop loader
                }
              }}
            >
              {deletingId === id ? "Deleting..." : "Yes"}
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-300 text-black rounded hover:bg-gray-400"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-12 items-center justify-between mb-4 bg-gray-800 p-4 rounded">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          📦 Product Management
        </h1>
        <a
          href="/add-product"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add Product
        </a>
      </div>

      {/* Loader / Skeleton */}
      {loading ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-800">
              <tr className="bg-gray-800 text-left text-sm font-semibold text-white-700">
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price (Rs)</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : products.length === 0 ? (
        <p className="mt-2 text-red-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-800 text-left text-sm font-semibold text-white-100">
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price (Rs)</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-black/70">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {p.price} PKR
                  </td>
                  <td className="px-6 py-4 space-x-4 space-y-2">
                    <button
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setEditingProduct(p)}
                    >
                      Edit
                    </button>
                   <button
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {deletingId === p.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={loadProducts}
        />
      )}

      {/* Toaster */}
      {/* <Toaster position="top-right" /> */}
    </div>
  );
}
