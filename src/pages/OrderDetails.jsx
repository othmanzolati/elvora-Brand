import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { ArrowLeft, User, Package, MapPin, Phone, ShoppingBag } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useAdmin();

  // Kan-qalbo 3la l-commande b-l-ID
  const order = orders.find((o) => String(o.id) === String(id));

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800">Commande introuvable !</h2>
        <button onClick={() => navigate("/admin")} className="mt-4 text-blue-600 underline">
          Retour au panneau
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Retour</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-xl font-bold">Détails de la Commande #{order.order_number}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
              {order.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* 1. Ma3loumat l-Customer */}
            <div className="p-6">
              <h2 className="flex items-center gap-2 text-blue-600 font-bold uppercase text-sm mb-6">
                <User size={18} /> Informations Client
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Nom Complet</p>
                  <p className="font-semibold text-gray-800">{order.customer.firstName} {order.customer.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Téléphone</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> {order.customer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Adresse & Ville</p>
                  <p className="font-semibold text-gray-800 flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-1" />
                    <span>{order.customer.address}, {order.customer.city}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Ma3loumat l-Product */}
            <div className="p-6">
              <h2 className="flex items-center gap-2 text-green-600 font-bold uppercase text-sm mb-6">
                <Package size={18} /> Produits Commandés
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-800 uppercase text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 font-medium">Taille: <span className="text-blue-600">{item.size}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-800">x{item.quantity}</p>
                      <p className="text-xs font-bold text-gray-400">{item.price} MAD</p>
                    </div>
                    <div className="text-right">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                     
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-800">TOTAL</span>
                  <span className="text-2xl font-black text-blue-600 italic">
                    {order.total.toFixed(2)} MAD
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

export default OrderDetails;