import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full w-full transition-all duration-500 ease-in-out"
    >
      {/* 1. Image Container - Kbira f l-Tele o Full Space */}
      <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-neutral-900 rounded-[2rem] mb-3 border border-white/10 group-hover:border-white/30 transition-all duration-500 shadow-2xl">
        <Link to={`/product/${product.id}`} className="w-full h-full block"> 
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.1 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            // object-cover kiy-khalli tswira t-ched l-kader kamel bla l-khwa f jnab
            className="w-full h-full object-cover"
          />
        </Link>
        
        {/* Overlay dima bayen bach l-smiya t-t9ra mzyan fo9 t-swira */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 pointer-events-none" />
        
        {/* Smiya o Price wast l-imaj f l-te7t bach i-bqaw baynin dima */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-[12px] md:text-[15px] font-black text-white uppercase tracking-tighter leading-tight truncate">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] md:text-[18px] font-black text-white">
              {product.price}
            </span>
            <span className="text-[8px] font-bold text-blue-500 uppercase">Mad</span>
          </div>
        </div>
      </div>

      {/* 2. Shop Now Button - Mobile Friendly */}
      <div className="mt-auto px-1"> 
        <Link 
          to={`/product/${product.id}`}
          className="w-full group/btn relative flex items-center justify-center gap-3 bg-white text-black py-3 md:py-4 rounded-xl transition-all duration-500 overflow-hidden hover:bg-blue-600 hover:text-white active:scale-[0.95]"
        >
          <span className="relative z-10 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">
            Shop Now
          </span>
          <ArrowRight size={14} className="relative z-10" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;