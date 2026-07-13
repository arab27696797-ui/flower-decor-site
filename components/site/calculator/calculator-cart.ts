// components/site/calculator/calculator-cart.ts
// Zustand store for the multi-accumulative estimate cart.
// Pure state/actions only — no UI, no persistence, no side effects.
// Each calculator category adds its own CartItem without overwriting others.

import { create } from 'zustand'
import {
  type CartItem,
  type EstimateCart,
  type CategoryId,
  type SelectionEntry,
  MARKUP_FACTOR,
  buildEstimateCart,
} from '@/lib/calculator-config'

// ---------------------------------------------------------------------------
// Helper — build a CartItem from raw category output
// ---------------------------------------------------------------------------

/**
 * Constructs a normalised CartItem ready to be added to the cart store.
 * Called by each category component after its local calculation is complete.
 *
 * @param categoryId     - The calculator category this item belongs to
 * @param categoryLabelRu - Russian display label for the category
 * @param selections     - Array of user selections (label + chosen value)
 * @param basePrice      - Raw price before markup (sum of selected option prices)
 */
export function buildCartItem(
  categoryId: CategoryId,
  categoryLabelRu: string,
  selections: SelectionEntry[],
  basePrice: number,
): CartItem {
  // Deterministic ID: one item per category — replacing an existing category
  // item is handled by the store's upsertItem action.
  const id = `category-${categoryId}`
  const subtotalBeforeMarkup = Math.round(basePrice)
  const subtotalWithMarkup   = Math.round(basePrice * MARKUP_FACTOR)

  return {
    id,
    categoryId,
    categoryLabelRu,
    selections,
    subtotalBeforeMarkup,
    subtotalWithMarkup,
  }
}

// ---------------------------------------------------------------------------
// Store state shape
// ---------------------------------------------------------------------------

interface CalculatorCartState {
  /** Ordered list of cart items — one per category, accumulated over time */
  items: CartItem[]

  /**
   * Derived totals — kept in sync automatically after every mutation.
   * These mirror the shape of EstimateCart for easy consumption by
   * the lead form and Telegram formatter.
   */
  totalBeforeMarkup: number
  totalWithMarkup:   number

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /**
   * Add a new category result to the cart.
   * If an item for the same categoryId already exists it is replaced —
   * this allows the user to re-calculate a category without duplicates.
   * Items are kept in insertion order; replacement preserves position.
   */
  upsertItem: (item: CartItem) => void

  /**
   * Remove a single item from the cart by its id.
   * Safe to call with a non-existent id — no-op in that case.
   */
  removeItem: (id: string) => void

  /**
   * Replace the item at a given id with an updated version.
   * Equivalent to removeItem + upsertItem but preserves array position.
   * Useful if the user edits a category that was already calculated.
   */
  replaceItem: (id: string, updated: CartItem) => void

  /**
   * Clear all items and reset totals to zero.
   */
  clearCart: () => void

  /**
   * Derive a full EstimateCart snapshot for use in the lead form payload
   * and Telegram formatter without exposing store internals.
   */
  getEstimateCart: () => EstimateCart
}

// ---------------------------------------------------------------------------
// Pure total computation — derives totals from items array
// ---------------------------------------------------------------------------

function computeTotals(items: CartItem[]): {
  totalBeforeMarkup: number
  totalWithMarkup:   number
} {
  // Re-use buildEstimateCart from lib/calculator-config.ts to avoid
  // duplicating the summing logic.
  const cart = buildEstimateCart(items)
  return {
    totalBeforeMarkup: cart.totalBeforeMarkup,
    totalWithMarkup:   cart.totalWithMarkup,
  }
}

// ---------------------------------------------------------------------------
// Zustand store
// ---------------------------------------------------------------------------

export const useCalculatorCart = create<CalculatorCartState>((set, get) => ({
  // Initial state
  items:             [],
  totalBeforeMarkup: 0,
  totalWithMarkup:   0,

  // ---------------------------------------------------------------------------
  upsertItem: (item: CartItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (existing) => existing.categoryId === item.categoryId,
      )

      let nextItems: CartItem[]

      if (existingIndex !== -1) {
        // Replace in-place to preserve the order of first insertion
        nextItems = state.items.map((existing, index) =>
          index === existingIndex ? item : existing,
        )
      } else {
        // Append new category item
        nextItems = [...state.items, item]
      }

      return { items: nextItems, ...computeTotals(nextItems) }
    })
  },

  // ---------------------------------------------------------------------------
  removeItem: (id: string) => {
    set((state) => {
      const nextItems = state.items.filter((item) => item.id !== id)
      return { items: nextItems, ...computeTotals(nextItems) }
    })
  },

  // ---------------------------------------------------------------------------
  replaceItem: (id: string, updated: CartItem) => {
    set((state) => {
      const nextItems = state.items.map((item) =>
        item.id === id ? updated : item,
      )
      return { items: nextItems, ...computeTotals(nextItems) }
    })
  },

  // ---------------------------------------------------------------------------
  clearCart: () => {
    set({ items: [], totalBeforeMarkup: 0, totalWithMarkup: 0 })
  },

  // ---------------------------------------------------------------------------
  getEstimateCart: (): EstimateCart => {
    return buildEstimateCart(get().items)
  },
}))

// ---------------------------------------------------------------------------
// Selector helpers — use these in components for targeted re-renders
// ---------------------------------------------------------------------------

/** Returns true if the cart has at least one item */
export const selectCartHasItems = (state: CalculatorCartState): boolean =>
  state.items.length > 0

/** Returns true if the given category already has a result in the cart */
export const selectCategoryInCart =
  (categoryId: CategoryId) =>
  (state: CalculatorCartState): boolean =>
    state.items.some((item) => item.categoryId === categoryId)

/** Returns the CartItem for a specific category, or undefined */
export const selectItemByCategory =
  (categoryId: CategoryId) =>
  (state: CalculatorCartState): CartItem | undefined =>
    state.items.find((item) => item.categoryId === categoryId)

/** Returns the formatted total with markup for display */
export const selectFormattedTotal =
  (state: CalculatorCartState): string =>
    state.totalWithMarkup > 0
      ? `${state.totalWithMarkup.toLocaleString('ru-RU')} ₽`
      : '—'

/** Returns item count — useful for the cart badge in the UI */
export const selectItemCount = (state: CalculatorCartState): number =>
  state.items.length
