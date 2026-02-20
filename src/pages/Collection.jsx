import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
// Beddelna hna l-import bach n-stakhdmo l-context l-i7tirafi
import { useAdmin } from "../context/AdminContext";
import { SlidersHorizontal, X, LayoutGrid } from "lucide-react";

// Texture "Grainy"
const noiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  opacity: '0.05'
};

const Collection = () => {
  // Kan-akhdou products men useAdmin hit houwa li fih Realtime
  const { products, loading } = useAdmin();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    sortBy: "relevant",
  });

  // Logic dyal Filter & Sort
  const filteredProducts = products
    ? products
        .filter((product) => {
          if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
          if (filters.types.length > 0 && !filters.types.includes(product.type)) return false;
          return true;
        })
        .sort((a, b) => {
          if (filters.sortBy === "price-low") return a.price - b.price;
          if (filters.sortBy === "price-high") return b.price - a.price;
          return 0;
        })
    : [];

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-24 relative overflow-hidden"> 
      
      {/* 1. Texture Grainy (Grain) */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={noiseStyle} />
      
      {/* 2. Aura/Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-50/70 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[700px] h-[700px] rounded-full bg-slate-100/80 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">
              All Collections
            </h1>
            <div className="flex items-center gap-3">
                <span className="h-[2px] w-10 bg-blue-600"></span>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                    {loading ? "Loading..." : `${filteredProducts.length} Items Available`}
                </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border border-white py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              <SlidersHorizontal size={14} className="text-blue-600" /> Filters
            </button>

            <div className="relative flex-1 md:flex-none">
                <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full md:w-auto px-8 py-4 bg-white/80 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer shadow-sm hover:bg-white transition-all pr-12"
                >
                <option value="relevant">Sort by: Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                </select>
                <LayoutGrid className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Sidebar Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-xl shadow-blue-900/5">
                <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                products={products || []}
                />
            </div>
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden"
                />
                <motion.div 
                  initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white/90 backdrop-blur-2xl z-[120] p-8 lg:hidden overflow-y-auto rounded-r-[40px] shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-10 pb-4 border-b">
                    <span className="font-black uppercase tracking-widest text-sm">Filters</span>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-xl"><X size={20}/></button>
                  </div>
                  <FilterSidebar filters={filters} setFilters={setFilters} products={products || []} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-[35px]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 3) * 0.1 }}
                    className="group bg-white/80 backdrop-blur-sm p-4 rounded-[35px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white relative overflow-hidden"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[40px] border-2 border-dashed border-white/60">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;