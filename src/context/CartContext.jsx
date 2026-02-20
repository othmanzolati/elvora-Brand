import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // 1. Kan-jbdou l-panier mn localStorage mlli kitcherja l-site
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Kollma t-beddel l-panier (cart), kan-seglouh f localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.size === product.size
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.id === productId && item.size === size)
    ));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) return; // Ma nkhalliwch l-quantité t-hbet 3la 1
    setCart(prevCart => prevCart.map(item =>
      item.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // Msa7 hta mn localStorage mlli t-khwa l-panier
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};