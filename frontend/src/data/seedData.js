export const CROPS = ['Cassava', 'Maize', 'Yam', 'Tomato']

// Must match the regions stored in the backend districts table
export const REGIONS = ['Ashanti', 'Central']

export const CROP_META = {
  Cassava: { emoji: '🥔', unit: 'Bags',   color: 'bg-amber-100 border-amber-300' },
  Maize:   { emoji: '🌽', unit: 'Bags',   color: 'bg-yellow-100 border-yellow-300' },
  Yam:     { emoji: '🍠', unit: 'Crates', color: 'bg-orange-100 border-orange-300' },
  Tomato:  { emoji: '🍅', unit: 'Crates', color: 'bg-red-100 border-red-300' },
}

export const TIMELINES = [
  { id: 'this-week',  label: 'Harvesting This Week', days: 7 },
  { id: 'two-weeks',  label: 'In 2 Weeks',           days: 14 },
  { id: 'one-month',  label: 'In 1 Month',           days: 30 },
]

// Mirrors the three districts seeded in the backend (Techiman, Ejura, Gomoa).
// cropSupplies is kept at 0 so the local fallback shows "High Demand"
// rather than inflated numbers when the API is unreachable.
export const DISTRICTS = [
  {
    id: 'techiman',
    name: 'Techiman',
    region: 'Ashanti',
    cropSupplies: {
      Cassava: { baseSupply: 0, farmers: 0 },
      Maize:   { baseSupply: 0, farmers: 0 },
      Yam:     { baseSupply: 0, farmers: 0 },
      Tomato:  { baseSupply: 0, farmers: 0 },
    },
  },
  {
    id: 'ejura',
    name: 'Ejura',
    region: 'Ashanti',
    cropSupplies: {
      Cassava: { baseSupply: 0, farmers: 0 },
      Maize:   { baseSupply: 0, farmers: 0 },
      Yam:     { baseSupply: 0, farmers: 0 },
      Tomato:  { baseSupply: 0, farmers: 0 },
    },
  },
  {
    id: 'gomoa',
    name: 'Gomoa',
    region: 'Central',
    cropSupplies: {
      Cassava: { baseSupply: 0, farmers: 0 },
      Maize:   { baseSupply: 0, farmers: 0 },
      Yam:     { baseSupply: 0, farmers: 0 },
      Tomato:  { baseSupply: 0, farmers: 0 },
    },
  },
]

// Districts shown in the farmer registration dropdown — must match the backend
export const FARMER_DISTRICTS = ['Techiman', 'Ejura', 'Gomoa']

export const BASE_PRICES = {
  Cassava: { low: 350, high: 380 },
  Maize:   { low: 280, high: 310 },
  Yam:     { low: 350, high: 380 },
  Tomato:  { low: 450, high: 490 },
}

export const MOFA_VALID_IDS = ['MOFA-2026-TEST', 'COOP-77']

export const SEED_FARMERS = []
export const SEED_EQUIPMENT = []
