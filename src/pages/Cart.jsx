import { useState, useEffect } from "react"; // Zid useEffect o useState
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Package, Clock, CheckCircle, Truck, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient"; // Importi supabase direct

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [myOrders, setMyOrders] = useState([]); // State jdid bach n-khbiw orders dyal client

  // --- Logic bach n-joubdou l-commandes dyal l-client bedtebt ---
  useEffect(() => {
    const fetchMyOrders = async () => {
      const currentDeviceId = localStorage.getItem("device_id");
      if (!currentDeviceId) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('deviceId', currentDeviceId) // Filter b l-ID dyal l-browser
          .order('date', { ascending: false });

        if (!error) setMyOrders(data || []);
      } catch (err) {
        console.error("Error fetching client orders:", err);
      }
    };

    fetchMyOrders();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { color: 'text-orange-600', bg: 'bg-orange-50', icon: <Clock size={14}/>, label: 'Pending' };
      case 'processing': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package size={14}/>, label: 'Processing' };
      case 'shipped': return { color: 'text-purple-600', bg: 'bg-purple-50', icon: <Truck size={14}/>, label: 'Shipped' };
      case 'completed': return { color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={14}/>, label: 'Completed' };
      case 'cancelled': return { color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={14}/>, label: 'Cancelled' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: <Clock size={14}/>, label: status };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden py-12">
      {/* ... (Nafs l-background li 3ndek) ... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <ShoppingBag className="text-blue-600 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Votre Panier</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {/* --- Cart Items Section --- */}
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white hover:border-blue-100 transition-all hover:shadow-md">
                    <div className="flex gap-6">
                      <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
                        <img src={item.image} alt={item.name} className="w-28 h-28 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">Taille: {item.size}</span>
                                <span className="text-blue-600 font-black text-sm">{item.price} MAD</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.size)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500">
                                <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-bold text-gray-700">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500">
                                <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm p-20 rounded-[40px] text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-400">Votre panier est vide</h2>
                <Link to="/collection" className="text-blue-600 font-bold text-sm mt-4 inline-block hover:underline">Découvrir nos produits</Link>
              </div>
            )}

            {/* --- Tracking Section (Dabba ghadi i-khdem dima) --- */}
            {myOrders.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-800">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  Mes Commandes Récentes
                </h2>
                <div className="grid gap-4">
                  {myOrders.map((order) => {
                    const style = getStatusStyle(order.status);
                    return (
                      <div key={order.id} className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #{order.order_number}</span>
                          <div className={`${style.bg} ${style.color} px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest`}>
                            {style.icon} {style.label}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-4">
                            {order.items.slice(0, 3).map((img, i) => (
                              <img key={i} src={img.image} className="h-12 w-12 rounded-xl border-4 border-white object-cover shadow-sm" alt="order item" />
                            ))}
                          </div>
                          <div className="ml-2">
                             <p className="text-xs font-bold text-gray-800">{order.items.length} article(s)</p>
                             <p className="text-lg font-black text-blue-600 leading-none mt-1">{order.total} MAD</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* --- Summary Sidebar --- */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-xl shadow-blue-900/5 sticky top-24 border border-white">
              <h2 className="text-xl font-black mb-6 text-gray-900">Résumé</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sous-total</span>
                  <span className="font-black text-gray-800">{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Livraison</span>
                  <span className="text-[10px] font-black bg-green-500 text-white px-3 py-1 rounded-full">OFFERTE</span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase">Total</span>
                  <div className="text-right">
                      <span className="text-3xl font-black text-blue-600 block leading-none">{total.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">MAD (TVA Incluse)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/checkout" className="flex items-center justify-center gap-2 w-full py-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-200">
                    Passer au Paiement
                </Link>
                <Link to="/collection" className="block w-full py-4 text-center rounded-2xl hover:bg-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-widest transition-all">
                    Continuer mes achats
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;