import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 1. Create Context
const ProductsContext = createContext();

// 2. Provider Component
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- A. Jib l-produits mn Supabase (Real-time data) ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // N-jiboo l-data mlli t-7el l-app l-merra l-ola
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- B. Tjib Produit b ID (bach t-khdem f ProductDetail) ---
  const getProductById = (id) => {
    // Kandiro String 7it ba3d l-merrat l-ID kiy-koun number aw UUID
    return products.find((p) => String(p.id) === String(id));
  };

  // --- C. Filter products b category (dyal l-Collection page) ---
  const getProductsByCategory = (category) => {
    if (!category || category === "All") return products;
    return products.filter((p) => p.category === category);
  };

  // --- D. Refresh Data ---
  // Had l-fonction tqder t-3iyetha mlli t-bghi t-t-akked mn l-data jdid
  const refreshProducts = () => {
    fetchProducts();
  };

  return (
    <ProductsContext.Provider 
      value={{ 
        products, 
        loading,
        getProductById,
        getProductsByCategory,
        refreshProducts
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// 3. Custom Hook
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};