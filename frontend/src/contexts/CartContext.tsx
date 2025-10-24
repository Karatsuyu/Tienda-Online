'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { Product } from '@/lib/types';
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { product: action.product, quantity: action.quantity }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', productId: action.productId });
      }

      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case 'LOAD_CART': {
      return {
        items: action.items,
        total: calculateTotal(action.items),
        itemCount: calculateItemCount(action.items),
      };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();
  const syncInProgressRef = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', items: parsedCart });
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Sync cart with backend when user authenticates
  useEffect(() => {
    if (isAuthenticated && !syncInProgressRef.current) {
      syncCartWithBackend();
    }
  }, [isAuthenticated]);

  const syncCartWithBackend = async () => {
    if (syncInProgressRef.current) return;
    syncInProgressRef.current = true;

    try {
      // Clear backend cart first by removing all items
      // Then sync local cart to backend
      for (const item of state.items) {
        try {
          await cartAPI.addItem(item.product.id, item.quantity);
        } catch (error) {
          console.error(`Error sincronizando artículo ${item.product.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error sincronizando carrito con backend:', error);
    } finally {
      syncInProgressRef.current = false;
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', product, quantity });

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await cartAPI.addItem(product.id, quantity);
      } catch (error) {
        console.error('Error al agregar artículo al carrito del backend:', error);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        const item = state.items.find(i => i.product.id === productId);
        if (item) {
          await cartAPI.removeItem(item.product.id);
        }
      } catch (error) {
        console.error('Error al eliminar artículo del carrito del backend:', error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        const item = state.items.find(i => i.product.id === productId);
        if (item) {
          if (quantity <= 0) {
            await cartAPI.removeItem(item.product.id);
          } else {
            await cartAPI.updateItem(item.product.id, quantity);
          }
        }
      } catch (error) {
        console.error('Error al actualizar artículo en el carrito del backend:', error);
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}