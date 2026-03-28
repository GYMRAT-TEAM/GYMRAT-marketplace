import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(3);
  const [checkedItems, setCheckedItems] = useState({});

  const addToCart = () => setCartCount(prev => prev + 1);

  const toggleItem = (itemId) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, checkedItems, toggleItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}