import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, RefreshCw, Loader2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext"; // Importer useAdmin
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import OrderTicket from "../components/OrderTicket";

const AdminOrders = () => {
  const navigate = useNavigate();
  
  // 1. Jbed kolchi mn l-Context (orders, updateOrderStatus, refreshData...)
  const { 
    isAuthenticated, 
    orders, 
    loading, 
    updateOrderStatus, 
    refreshData 
  } = useAdmin();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `ELVORA-Order`,
  });

  // 2. 7iyedna fetchOrders l-9dima o setOrders l-9dima
  // Daba ghadi n-sta3mlo l-fonctions dyal l-Context nichan

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden">
        <div ref={componentRef}>
          <OrderTicket order={selectedOrder} />
        </div>
      </div>

      <div className="bg-white shadow-sm border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Orders Dashboard</h1>
          </div>
          {/* Sta3mel refreshData dyal Context bach t-update l-global state */}
          <button onClick={refreshData} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed font-medium text-gray-400">
            No orders found in database.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                      <h3 className="text-sm font-mono font-bold text-blue-600">#{order.order_number}</h3>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString('fr-FR')}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedOrder(order); setTimeout(() => handlePrint(), 200); }} className="p-2 bg-gray-900 text-white rounded-lg"><Printer className="w-4 h-4" /></button>
                      
                      {/* 3. Sta3mel updateOrderStatus dyal l-Context nichan */}
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold border rounded-lg px-2 py-1 outline-none ${
                          order.status === 'pending' ? 'border-yellow-500 text-yellow-600' :
                          order.status === 'completed' ? 'border-green-500 text-green-600' :
                          'border-red-500 text-red-600'
                        }`}
                      >
                            <option value="Pending">Pending</option>
                            <option value="processing">processing</option>
                            <option value="shipped">shipped</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Customer Details</h4>
                      <p className="text-sm font-bold">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-sm text-blue-600 font-medium">{order.customer?.phone}</p>
                      <p className="text-xs text-gray-500">{order.customer?.address}, {order.customer?.city}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Order Items</h4>
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-xs flex justify-between bg-gray-50 p-2 rounded">
                            <span>{item.quantity}x {item.name} ({item.size})</span>
                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                          </div>
                          
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase">Cash on Delivery</span>
                    <p className="text-lg font-black">Total: <span className="text-blue-600">${order.total}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;