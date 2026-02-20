import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById, products } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [mainContent, setMainContent] = useState({ url: "", type: "image" });
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const data = getProductById(id);
    if (data) {
      setProduct(data);
      // L-image l-asasiya
      setMainContent({ url: data.image, type: "image" });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [id, getProductById]);

  if (!product) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-[0.3em]">Loading...</div>;

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  // --- Logic dyal l-Gallery Jdid ---
  // Kan-akhdo l-image l-asasiya + ga3 l-tsawr li f gallery array
  const fullGallery = [product.image, ...(product.gallery || [])].filter(Boolean);
  
  // Ila kan l-video, kan-zidoh f lekher dyal l-gallery
  const mediaList = [...fullGallery];
  if (product.video_360) mediaList.push(product.video_360);

  const isVideo = (url) => url?.includes("video") || url?.match(/\.(mp4|webm|ogg)$/);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-20">
        
        {/* --- LEFT: GALLERY --- */}
        <div className="flex flex-col-reverse md:flex-row gap-3 w-full lg:w-[50%]">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 overflow-x-auto shrink-0 no-scrollbar">
            {mediaList.map((item, index) => (
              <div 
                key={index}
                onClick={() => setMainContent({ url: item, type: isVideo(item) ? "video" : "image" })}
                className={`w-12 h-16 md:w-14 md:h-18 flex-shrink-0 cursor-pointer border transition-all rounded-md overflow-hidden ${
                  mainContent.url === item ? "border-slate-800 scale-95" : "border-slate-100 opacity-60"
                }`}
              >
                {isVideo(item) ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[8px] text-white uppercase font-black">360°</div>
                ) : (
                  <img src={item} alt="thumb" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>

          {/* Main Display */}
          <div className="flex-1 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative aspect-[4/5] max-h-[450px]">
            {mainContent.type === "video" ? (
              <video 
                key={mainContent.url} 
                src={mainContent.url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img src={mainContent.url} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* --- RIGHT: INFO SECTION --- */}
        <div className="w-full lg:w-[50%] flex flex-col justify-start">
          <nav className="text-[9px] text-slate-400 mb-2 uppercase tracking-widest font-bold">
            {product.category} / Shop
          </nav>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-slate-950 text-2xl font-black">{product.price} MAD</span>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest bg-slate-100 px-2 py-1 rounded">En Stock</span>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed mb-8 border-l-2 border-slate-200 pl-4">
            {product.description}
          </p>

          {/* SIZES */}
          <div className="mb-8">
            <h3 className="font-bold text-[10px] uppercase text-slate-400 tracking-widest mb-3">Taille</h3>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 flex items-center justify-center border text-[10px] font-black transition-all rounded-lg ${
                    selectedSize === size 
                    ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200" 
                    : "border-slate-200 text-slate-500 hover:border-slate-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={() => selectedSize ? addToCart({...product, size: selectedSize}) : alert("Veuillez sélectionner une taille")}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-100 mb-8"
          >
            Ajouter Au Panier
          </button>

          {/* SHIPPING & RETURNS */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500">
               <span className="flex items-center gap-2">🚚 Livraison gratuite</span>
               <span className="text-slate-300 font-normal">Partout au Maroc</span>
             </div>
             <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500">
               <span className="flex items-center gap-2">🔄 Retours</span>
               <span className="text-slate-300 font-normal">Sous 7 jours</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- RELATED PRODUCTS --- */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-100">
          <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 mb-8">Articles Similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;