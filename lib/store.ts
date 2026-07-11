import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartItem = {
  id: string          // уникальный id позиции в корзине (uuid)
  productId: string   // id категории/товара из PricingRule или иного каталога
  label: string        // название позиции для отображения
  calcType: string     // тип расчёта (соответствует PricingRule.calcType)
  category: string     // категория (соответствует PricingRule.category)
  quantity: number
  unitPrice: number    // цена за единицу (результат pricing.ts)
  isArtificial: boolean // искусственные цветы/шары или живые
  meta?: Record<string, unknown> // произвольные доп. параметры расчёта
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    {
      name: 'floral-decor-cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
