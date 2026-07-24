import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [storeId, setStoreId] = useState(null);
  const [storeName, setStoreName] = useState(null);
  const [items, setItems] = useState([]);

  const addItem = useCallback((item, forStoreId, forStoreName) => {
    setItems((prev) => {
      // Switching stores clears the cart — mirrors most delivery apps.
      if (storeId && storeId !== forStoreId) {
        return [{ ...item, cartId: crypto.randomUUID() }];
      }
      return [...prev, { ...item, cartId: crypto.randomUUID() }];
    });
    setStoreId(forStoreId);
    setStoreName(forStoreName);
  }, [storeId]);

  const removeItem = useCallback((cartId) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setStoreId(null);
    setStoreName(null);
  }, []);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ storeId, storeName, items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
