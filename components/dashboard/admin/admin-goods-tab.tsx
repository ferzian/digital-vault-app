"use client";

import { useState, useEffect } from "react";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiMagnifyingGlass,
  HiCube,
  HiArrowPath,
  HiXMark,
  HiCheckCircle,
  HiNoSymbol,
} from "react-icons/hi2";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  format: string | null;
  version: string;
  fileSize: string | null;
  fileUrl: string | null;
  badge: string | null;
  licenseType: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    transactions: number;
    vaultItems: number;
  };
}

export function AdminGoodsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Source Code",
    price: "49.00",
    description: "",
    format: "ZIP + GitHub Access",
    version: "v1.0.0",
    fileSize: "25.0 MB",
    fileUrl: "",
    badge: "New",
    licenseType: "Commercial License",
    isActive: true,
  });

  const categories = [
    "ALL",
    "Source Code",
    "Design System",
    "Developer Tool",
    "Security Plugin",
    "Templates",
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "ALL"
          ? `/api/admin/products?search=${encodeURIComponent(search)}`
          : `/api/admin/products?category=${encodeURIComponent(
              selectedCategory
            )}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search]);

  const openCreateModal = () => {
    setFormData({
      title: "",
      category: "Source Code",
      price: "49.00",
      description: "",
      format: "ZIP + GitHub Access",
      version: "v1.0.0",
      fileSize: "25.0 MB",
      fileUrl: "",
      badge: "New",
      licenseType: "Commercial License",
      isActive: true,
    });
    setActionError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      format: product.format || "ZIP Archive",
      version: product.version || "v1.0.0",
      fileSize: product.fileSize || "10.0 MB",
      fileUrl: product.fileUrl || "",
      badge: product.badge || "",
      licenseType: product.licenseType || "Commercial License",
      isActive: product.isActive,
    });
    setActionError(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);

    try {
      const isEdit = !!editingProduct;
      const url = isEdit
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to save product.");
        return;
      }

      setIsCreateOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      setActionError(err.message || "An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete product.");
        return;
      }
      setDeletingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleActiveStatus = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error toggling product status:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Top Header & Search Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <HiMagnifyingGlass className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search title, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
            title="Reload Products"
          >
            <HiArrowPath className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 transition-all cursor-pointer"
        >
          <HiPlus className="w-4 h-4" />
          <span>Add Digital Good</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                : "bg-neutral-100 dark:bg-neutral-950 text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
            }`}
          >
            {cat === "ALL" ? "All Goods" : cat}
          </button>
        ))}
      </div>

      {/* Table / Empty State */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400">Loading catalog items...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="py-14 px-4 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center mb-3">
            <HiCube className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            No Digital Goods Found
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Create your first digital asset or adjust your search filter.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white shadow-sm hover:bg-sky-600 transition-colors cursor-pointer"
          >
            Create Product Now
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Product Name &amp; Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Format / Version</th>
                <th className="py-3.5 px-4">Catalog Status</th>
                <th className="py-3.5 px-4">Sales / Vaults</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
              {products.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500 border border-sky-500/20">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-0.5">
                        {item.category} • <span className="font-mono">{item.slug}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                    <div>{item.format || "ZIP Archive"}</div>
                    <div className="text-[10px] text-neutral-400">
                      {item.version} ({item.fileSize || "N/A"})
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleActiveStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                        item.isActive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <HiCheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <HiNoSymbol className="w-3.5 h-3.5" />
                          <span>Draft / Hidden</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-neutral-600 dark:text-neutral-300">
                    <span className="font-mono font-semibold text-sky-500">
                      {item._count?.vaultItems || 0}
                    </span>{" "}
                    vaults ({item._count?.transactions || 0} orders)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <HiPencilSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(item)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Delete / Deactivate Product"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreateOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setIsCreateOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
              {editingProduct ? "Edit Digital Good" : "Add New Digital Good"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Configure product details, delivery format, pricing, and catalog visibility.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Next.js SaaS Enterprise Boilerplate"
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Source Code">Source Code</option>
                    <option value="Design System">Design System</option>
                    <option value="Developer Tool">Developer Tool</option>
                    <option value="Security Plugin">Security Plugin</option>
                    <option value="Templates">Templates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="49.00"
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Format &amp; Packaging
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    placeholder="e.g. ZIP + GitHub Access"
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.0.0"
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g. 24.5 MB"
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Best Seller, Trending, New"
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Download Storage URL / Endpoint
                  </label>
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="https://vault-storage.internal/assets/..."
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Product Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive description of the digital good, features, and usage instructions..."
                    className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500"
                  />
                  <label
                    htmlFor="isActiveCheck"
                    className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    Active in Public Catalog (Users can browse &amp; purchase)
                  </label>
                </div>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                  {actionError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / DEACTIVATE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 mx-auto flex items-center justify-center mb-4">
              <HiTrash className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Delete or Deactivate Product?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                &apos;{deletingProduct.title}&apos;
              </span>
              ? If users have previously acquired this asset, it will be safely deactivated from the public catalog.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoading ? "Processing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
