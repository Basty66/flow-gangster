import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'flowgangster_cart';

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { producto, talle, cantidad } = action.payload;
      const existing = state.find(
        (i) => i.producto.id === producto.id && i.talle === talle
      );
      if (existing) {
        return state.map((i) =>
          i.producto.id === producto.id && i.talle === talle
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...state, { producto, talle, cantidad }];
    }
    case 'REMOVE_ITEM':
      return state.filter((_, idx) => idx !== action.payload);
    case 'UPDATE_CANTIDAD':
      return state.map((item, idx) =>
        idx === action.payload.index
          ? { ...item, cantidad: Math.max(1, action.payload.cantidad) }
          : item
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (producto, talle, cantidad = 1) =>
    dispatch({ type: 'ADD_ITEM', payload: { producto, talle, cantidad } });

  const removeItem = (index) =>
    dispatch({ type: 'REMOVE_ITEM', payload: index });

  const updateCantidad = (index, cantidad) =>
    dispatch({ type: 'UPDATE_CANTIDAD', payload: { index, cantidad } });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = items.reduce(
    (sum, i) => sum + i.producto.precio * i.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateCantidad, clearCart, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
