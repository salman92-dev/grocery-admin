"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import EditProductModal from "./components/update-product";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaBox, FaTrash, FaEdit, FaSearch, FaSync, FaShoppingBag } from "react-icons/fa";

// ---- Utility components ----
const EmptyState = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FaShoppingBag className="text-gray-400 text-3xl" />
    </div>
    <p className="text-lg font-medium text-gray-600">{message}</p>
  </motion.div>
);

const ProductCard = ({ p, onEdit, onDelete, deletingId, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ y: -4 }}
    className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 group"
  >
    {/* Image */}
    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
      <Image 
        src={p.image} 
        alt={p.name} 
        fill 
        className="object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <div className="absolute top-3 right-3">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-green-600 rounded-full shadow-lg">
          Rs. {p.price}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <div className="mb-3">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
            {p.category}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(p)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 font-semibold text-sm transition-all duration-200 border border-blue-200"
        >
          <FaEdit size={14} /> Edit
        </button>
        <button
          disabled={deletingId === p.id}
          onClick={() => onDelete(p.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
        >
          {deletingId === p.id ? (
            <>
              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </>
          ) : (
            <>
              <FaTrash size={14} /> Delete
            </>
          )}
        </button>
      </div>
    </div>
  </motion.div>
);

// ---- Main page component ----
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const localuser = typeof window !== "undefined" && localStorage.getItem("user");
    if (!localuser) {
      router.replace("/login");
      return;
    }
    setUserLoading(false);
  }, [router]);

  // Online/offline handling
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch products
  const loadProducts = useCallback(async (signal) => {
    setLoading(true);
    try {
      if (offline) {
        toast.error("You are offline — cannot load products");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/fetch-data", { cache: "no-store", signal });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error(err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [offline]);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  // Logout
  const Logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  // Delete flow
  const handleDelete = useCallback((id) => {
    toast((t) => (
      <div className="flex flex-col space-y-3">
        <p className="font-semibold text-gray-900">Delete Product?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            disabled={deletingId === id}
            className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold disabled:opacity-50 transition-all"
            onClick={async () => {
              setDeletingId(id);
              toast.dismiss(t.id);
              const prev = products;
              setProducts((p) => p.filter((x) => x.id !== id));
              try {
                const res = await fetch(`/api/delete-product/${id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Delete failed");
                toast.success("Product deleted successfully");
              } catch (err) {
                console.error(err);
                setProducts(prev);
                toast.error("Failed to delete product");
              } finally {
                setDeletingId(null);
              }
            }}
          >
            {deletingId === id ? "Deleting..." : "Delete"}
          </button>
          <button 
            className="flex-1 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all" 
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  }, [deletingId, products]);

  // Search / Filter
  const filtered = useMemo(() => {
    if (!query) return products;
    const q = query.trim().toLowerCase();
    return products.filter((p) => (p.name || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q));
  }, [products, query]);

  if (userLoading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 font-semibold">Checking authentication...</p>
    </div>
  );

  if (offline) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      <div className="text-6xl mb-4">📡</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Internet Connection</h2>
      <p className="text-gray-600">Please check your connection and try again</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
              <FaBox size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-1">
                Product Management
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Manage your shop — fast, reliable, and beautiful
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a 
              href="/add-product" 
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </a>
            <button 
              onClick={Logout} 
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        </motion.header>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{products.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Products</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{filtered.length}</div>
            <div className="text-sm text-gray-600 mt-1">Showing</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {new Set(products.map(p => p.category)).size}
            </div>
            <div className="text-sm text-gray-600 mt-1">Categories</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Price (PKR)</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
        >
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400" 
              placeholder="Search by name or category..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => loadProducts()} 
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-purple-300 font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <FaSync className="w-4 h-4" />
            Refresh
          </button>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                  <div className="bg-gray-200 h-48"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2 pt-3">
                      <div className="h-9 bg-gray-200 rounded-xl flex-1"></div>
                      <div className="h-9 bg-gray-200 rounded-xl flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message={products.length === 0 ? "No products found. Add your first product!" : "No results for your search."} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((p, index) => (
              <ProductCard 
                key={p.id} 
                p={p} 
                index={index}
                onEdit={(prod) => setEditingProduct(prod)} 
                onDelete={handleDelete} 
                deletingId={deletingId} 
              />
            ))}
          </motion.div>
        )}

        {/* Edit modal */}
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            isOpen={!!editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={() => {
              loadProducts();
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}