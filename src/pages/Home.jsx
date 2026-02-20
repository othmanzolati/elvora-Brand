import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Headset } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAdmin } from "../context/AdminContext";

// --- 1. Video Background Component ---
const VideoBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'brightness(0.9)' }} // Kat-khalli l-video i-bqa dawi
    >
      <source src="/bg-luxury.mp4" type="video/mp4" />
    </video>
    
    {/* Overlay khfif bzaf ghir bach l-ktiba t-ban, walakin l-video kiy-bqa bayen wa7ed */}
    <div className="absolute inset-0 bg-black/30" /> 
    
    {/* Had l-gradient kiy-khalli l-video i-welli k7al ghir f l-7awach (edges) */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
  </div>
);

// --- 2. Intro Video Component ---
const IntroVideo = ({ onVideoEnd }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* <video
        autoPlay
        muted
        playsInline
        onEnded={onVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="./intro-3d.mp4" type="video/mp4" />
      </video> */}

      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        // Hada hwa l-7el l-logic:
        src={`${import.meta.env.BASE_URL}intro-3d.mp4`} 
      >
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
};

// --- 3. Main Home Component ---
const Home = () => {
  const { products } = useAdmin();
  const featuredProducts = products ? products.slice(0, 8) : [];
  
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  const slides = [
    { id: 1, image: "https://zupimages.net/up/26/02/hyx7.png", title: "LUXURY DESIGN", subtitle: "The Art of Minimalist Living" },
    { id: 2, image: "https://zupimages.net/up/26/02/fhzs.png", title: "PURE MODERN", subtitle: "Bespoke Solutions for Interiors" },
    { id: 3, image: "https://zupimages.net/up/26/02/n2ov.png", title: "PREMIUM FINISH", subtitle: "Excellence in Every Detail" }
  ];

  useEffect(() => {
    if (!showIntro) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [showIntro, slides.length]);

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroVideo key="intro" onVideoEnd={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* ===== HERO SECTION ===== */}
            <section className="relative h-screen w-full overflow-hidden bg-black z-30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={slides[currentIndex].image} 
                      className="w-full h-full object-cover brightness-[0.5]" 
                      alt="hero" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                    <motion.span 
                      initial={{ y: 10, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      className="text-blue-500 uppercase tracking-[0.6em] text-[10px] mb-6 font-black"
                    >
                      {slides[currentIndex].subtitle}
                    </motion.span>
                    
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      className="text-white text-5xl md:text-[110px] font-black tracking-tighter leading-none mb-12 uppercase italic"
                    >
                      {slides[currentIndex].title}
                    </motion.h1>

                    <Link to="/collection" className="group relative inline-flex items-center gap-6 px-12 py-5 overflow-hidden border border-white/20 rounded-full bg-white/5 backdrop-blur-md hover:bg-white transition-all duration-500">
                      <span className="relative z-10 text-white group-hover:text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                        Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Indicators */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {slides.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)} 
                    className={`h-[1px] transition-all duration-1000 ${index === currentIndex ? "w-20 bg-white" : "w-8 bg-white/20"}`} 
                  />
                ))}
              </div>
            </section>

            {/* ===== FEATURED PRODUCTS SECTION (With Video) ===== */}
            <section className="relative py-32 md:py-48 overflow-hidden bg-black z-20">
              
              {/* Zidna l-video background hna */}
              <VideoBackground />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="mb-24 space-y-4"
                >
                  <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.8em] block">
                    Curated Selection
                  </span>
                  <h2 className="text-5xl md:text-8xl font-black text-white leading-tight uppercase tracking-tighter italic">
                    Featured Collection
                  </h2>
                </motion.div>

                {/* Products Grid - Glass Cards */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
                >
                  {featuredProducts.map((product) => (
                    <motion.div 
                      key={product.id} 
                      variants={itemVariants}
                      className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-[3rem] border border-white/10 shadow-2xl hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden"
                    >
                      <ProductCard product={product} />
                      {/* Glow Effect on Hover */}
                      <div className="absolute -inset-1 bg-blue-600/10 rounded-[3.1rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* View All Button */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-24 flex justify-center"
                >
                  <Link to="/collection" className="group flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
                    View All Products <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* ===== FOOTER INFO SECTION ===== */}
            <section className="py-32 bg-black text-white relative z-30 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
                
                {[
                  { icon: <Truck />, title: "Global Shipping", desc: "Premium delivery service" },
                  { icon: <ShieldCheck />, title: "Safe Payment", desc: "100% Secure transactions" },
                  { icon: <Headset />, title: "24/7 Support", desc: "Dedicated concierge team" }
                ].map((info, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="p-8 bg-white/5 rounded-[2.5rem] mb-6 border border-white/5 group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all text-blue-500">
                      {info.icon}
                    </div>
                    <h3 className="text-[11px] font-black tracking-[0.4em] uppercase mb-3">{info.title}</h3>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest leading-relaxed">{info.desc}</p>
                  </motion.div>
                ))}

              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;