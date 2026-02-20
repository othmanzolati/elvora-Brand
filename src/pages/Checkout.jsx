import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from '../supabaseClient';

// --- Success Modal Component ---
const SuccessModal = ({ orderNumber }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-xl"
    >
      <div className="flex justify-center mb-6">
        <CheckCircle size={60} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Commande Confirmée</h2>
      <p className="text-gray-600 mb-6">Numéro de commande: <span className="font-bold text-black">#{orderNumber}</span></p>
      <Link 
        to="/collection" 
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
      >
        BACK TO SHOP <ArrowRight size={18} />
      </Link>
    </motion.div>
  </motion.div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", postalCode: "", country: "Maroc",
  });

  useEffect(() => {
    const existingDeviceId = localStorage.getItem("device_id");
    if (!existingDeviceId) {
      const newId = "dev_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem("device_id", newId);
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; 
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const currentDeviceId = localStorage.getItem("device_id");

      // 1. Logic bach njibou l-order number jdid
      // Mola7ada: Hada SELECT, khass t-koun 3ndek SELECT policy l-ga3 l-nas (anon) bach t-khdem
      const { data: lastOrder } = await supabase
        .from('orders')
        .select('order_number')
        .order('order_number', { ascending: false })
        .limit(1);

      let nextNumber = 100;
      if (lastOrder && lastOrder.length > 0) {
        nextNumber = lastOrder[0].order_number + 1;
      }

      const orderData = {
        customer: formData,
        items: cart,
        total: total,
        status: 'pending',
        date: new Date().toISOString(),
        order_number: nextNumber,
        deviceId: currentDeviceId
      };

      // 2. L-INSERT m9ad (7eyyedna .select() bach ma-itla3ch 401 Unauthorized)
      const { error: insertError } = await supabase
        .from('orders')
        .insert([orderData]);
      
      if (insertError) throw insertError;

      // Ila wselna hna, ya3ni l-insert khdam
      setConfirmedOrderNumber(nextNumber);
      setIsSuccess(true);
      clearCart();

    } catch (err) {
      console.error("Checkout Error Details:", err);
      alert("Erreur lors de la commande: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AnimatePresence>
        {isSuccess && <SuccessModal orderNumber={confirmedOrderNumber} />}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
              <h2 className="font-bold text-lg border-b pb-4">Informations Personnelles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="Prénom" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
                <input type="text" name="lastName" placeholder="Nom" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all md:col-span-2" />
                <input type="tel" name="phone" placeholder="Téléphone" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all md:col-span-2" />
              </div>

              <h2 className="font-bold text-lg border-b pb-4 pt-4">Adresse de Livraison</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" name="address" placeholder="Adresse" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all md:col-span-2" />
                <input type="text" name="city" placeholder="Ville" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
                <input type="text" name="postalCode" placeholder="Code Postal" onChange={handleChange} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400 mt-6"
              >
                {loading ? "Chargement..." : "Confirmer ma commande"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                    <span className="font-medium">{item.price * item.quantity} MAD</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-800 uppercase text-xs tracking-widest">FREE</span>
                </div>
                <div className="border-t border-gray-800 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {total.toFixed(2)} MAD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;