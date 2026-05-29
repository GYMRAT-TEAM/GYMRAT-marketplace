import { createContext, useContext, useState } from 'react';

const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
  shippingCost: 0,
  setShippingCost: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {}
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal   = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax        = subtotal * 0.08;
  const total      = subtotal + tax + shippingCost;

  function addToCart(product) {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + product.qty } : i
        );
      }
      return [...prev, product];
    });
  }

  function removeFromCart(id) {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQty(id, qty) {
    if (qty < 1) return;
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty } : i)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, subtotal, tax, total,
      shippingCost, setShippingCost,
      addToCart, removeFromCart, updateQty, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);