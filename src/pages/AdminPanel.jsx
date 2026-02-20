import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ShoppingBag, LogOut, Plus, Trash2, Eye, Printer, Search } from "lucide-react"; 
import { useAdmin } from "../context/AdminContext";
import OrderTicket from "../components/OrderTicket";
import { supabase } from "../supabaseClient";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout, orders, setOrders, deleteOrder, updateOrderStatus } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [printOrder, setPrintOrder] = useState(null);

  // --- Auto-Refresh Logic (Realtime Optimized) ---
  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Re-fetch b l-customer data bach t-ban smiya o t-tlifone
            const { data: newOrderFull } = await supabase
              .from('orders')
              .select('*, customer:customers(*)')
              .eq('id', payload.new.id)
              .single();

            if (newOrderFull) {
              setOrders((prev) => [newOrderFull, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((order) => (order.id === payload.new.id ? { ...order, ...payload.new } : order))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((order) => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setOrders]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const filteredOrders = orders.filter((order) => {
    const searchStr = searchTerm.toLowerCase();
    const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.toLowerCase();
    const orderNum = String(order.order_number || "").toLowerCase();
    const phone = String(order.customer?.phone || "");

    return customerName.includes(searchStr) || orderNum.includes(searchStr) || phone.includes(searchStr);
  });

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Package,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Completed Orders",
      value: orders.filter((o) => o.status === "completed").length,
      icon: Package,
      color: "bg-green-100 text-green-600",
    },
  ];

  const handlePrint = (order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden">
        {/* Navbar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Rechercher par N° de commande, nom ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Gestion des Produits</h2>
                <p className="text-gray-500 text-sm">Ajouter ou modifier vos articles.</p>
              </div>
              <Link to="/admin/products" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                <Plus className="w-6 h-6" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Toutes les Commandes</h2>
                <p className="text-gray-500 text-sm">Voir l'historique complet.</p>
              </div>
              <Link to="/admin/orders" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 font-medium">
                Voir tout
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Commandes Récentes</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-blue-600">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{order.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {order.total} MAD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-none cursor-pointer focus:ring-0 ${
                            order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            order.status === "completed" ? "bg-green-100 text-green-700" :
                            "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/admin/orders/${order.id}`)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handlePrint(order)} className="p-2 text-emerald-500 hover:bg-emerald-100 rounded-lg">
                            <Printer className="w-5 h-5" />
                          </button>
                          <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Print View */}
      <div className="hidden print:block">
        {printOrder && <OrderTicket order={printOrder} />}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;