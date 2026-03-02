import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] }
    }
    case 'REMOVE': {
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }
    }
    case 'SET_QTY': {
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.product.id === action.productId ? { ...i, quantity: Math.max(1, action.quantity) } : i,
          )
          .filter((i) => i.quantity > 0),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  const value = useMemo(() => {
    const total = state.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0)

    return {
      items: state.items,
      total,
      addToCart: (product) => dispatch({ type: 'ADD', product }),
      removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QTY', productId, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
