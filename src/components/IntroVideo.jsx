import { motion } from "framer-motion";

const IntroVideo = ({ onVideoEnd }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }} // Animation fach k-i-ghader l-intro
      transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* 1. L-Video Full Screen */}
      <video
        autoPlay
        muted
        playsInline
        onEnded={onVideoEnd} // Fach k-i-sali l-video k-i-t-7el l-site
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/intro-3d.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Overlay khfif bach t-bqa l-vibe noir */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 3. Skip Button (ikhtiyari) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onVideoEnd}
        className="absolute bottom-10 right-10 z-[1001] text-white/50 text-[10px] uppercase tracking-[0.4em] hover:text-white transition-colors border border-white/20 px-6 py-2 rounded-full backdrop-blur-md"
      >
        Skip Intro
      </motion.button>
    </motion.div>
  );
};

export default IntroVideo;