import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'flowgangster_cart';

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { producto, talle, cantidad } = action.payload;
      const idx = state.findIndex((i) => i.producto.id === producto.id);
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + cantidad };
        return next;
      }
      return [...state, { producto, talle, cantidad }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.producto.id !== action.payload);
    case 'UPDATE_CANTIDAD': {
      const idx = state.findIndex((i) => i.producto.id === action.payload.id);
      if (idx < 0) return state;
      const next = [...state];
      next[idx] = { ...next[idx], cantidad: Math.max(1, action.payload.cantidad) };
      return next;
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);
  const [cupon, setCupon] = useState('');
  const [cuponData, setCuponData] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (producto, talle, cantidad = 1) =>
    dispatch({ type: 'ADD_ITEM', payload: { producto, talle, cantidad } });

  const removeItem = (id) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id });

  const updateCantidad = (id, cantidad) =>
    dispatch({ type: 'UPDATE_CANTIDAD', payload: { id, cantidad } });

  const clearCart = () => { setCupon(''); setCuponData(null); dispatch({ type: 'CLEAR' }); };

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateCantidad, clearCart, totalItems, total, cupon, setCupon, cuponData, setCuponData }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
