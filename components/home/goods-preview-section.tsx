"use client";

import { useState, useEffect } from "react";
import { CheckoutModal, ProductItem } from "@/components/checkout-modal";
import { HiCube, HiLockClosed } from "react-icons/hi2";

export function GoodsPreviewSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = [
    "ALL",
    "Source Code",
    "Design System",
    "Developer Tool",
    "Security Plugin",
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "ALL"
          ? "/api/products"
          : `/api/products?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleBuyClick = (item: ProductItem) => {
    setSelectedProduct(item);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="goods" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-sky-500 mb-2">
            Featured Catalog
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Trending Digital Goods in Vault
          </h2>
        </div>
        <p className="mt-2 md:mt-0 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
          Instant cryptographic fulfillment and encrypted vault storage upon settlement.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
            }`}
          >
            {cat === "ALL" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse border border-neutral-200 dark:border-neutral-800"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <HiCube className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">No products found</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            No items in this category yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 shadow-sm hover:shadow-xl hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    {item.category}
                  </span>
                  {item.badge && (
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
                  <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {item.format || "ZIP Archive"}
                  </span>
                  <span>•</span>
                  <span>{item.version || "v1.0.0"}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Price</span>
                  <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
                    ${item.price}
                  </div>
                </div>
                <button
                  onClick={() => handleBuyClick(item)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <HiLockClosed className="w-3.5 h-3.5" />
                  <span>Unlock Asset</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        product={selectedProduct}
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
}
