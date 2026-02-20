import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="bg-white min-h-screen font-sans overflow-hidden">
      {/* 1. Hero Section - The Brand Name */}
      <section className="relative py-20 lg:py-32 px-6 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 block"
          >
            The ELVORA Concept
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-slate-900 leading-tight uppercase tracking-tighter"
          >
            The Art of <br /> In-House Creation
          </motion.h1>
        </div>
      </section>

      {/* 2. Story Section - Your Journey with ELVORA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-2xl"
          >
            {/* Recommendation: A real photo of you or your studio */}
            <img 
              src={`${import.meta.env.BASE_URL}elvora.jpg`} 
              alt="ELVORA Workshop" 
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-slate-900/20" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">My Journey</h2>
            <div className="w-12 h-1 bg-slate-900" />
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              ELVORA started with a simple idea: to seek perfection in design and printing. We didn't want to just be another brand that sells; we wanted to be a brand that creates.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
              Today, I have established my own printing studio to control every stitch and every print. When you buy from ELVORA, you are buying something created in our workshop, by our hands, and with our passion for the craft.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-slate-900 text-xl tracking-tighter">100%</h4>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">In-house Print</p>
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xl tracking-tighter">Premium</h4>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Quality Fabric</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Values Section - Triple Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                t: "The Precision", 
                d: "Every ELVORA print goes through a manual inspection to ensure its durability and sharpness." 
              },
              { 
                t: "The Fabric", 
                d: "We don't just use any fabric. We select the finest materials that feel premium against your skin." 
              },
              { 
                t: "The Vision", 
                d: "Our goal is to show the world that Moroccan craftsmanship can reach global luxury standards." 
              }
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 border border-slate-50 hover:border-slate-200 transition-all rounded-2xl group"
              >
                <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-4 group-hover:translate-x-2 transition-transform">
                  {v.t}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Call to Action - Footer Style */}
      <section className="py-20 bg-slate-900 text-white rounded-t-[3rem] mx-2">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">
            "We make the difference <br /> with our hands."
          </h2>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-12 font-bold">Follow the ELVORA journey</p>
          <button className="bg-white text-slate-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
            Follow @ELVORA
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;