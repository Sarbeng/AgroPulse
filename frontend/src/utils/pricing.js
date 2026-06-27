import { BASE_PRICES } from '../data/seedData'

export function getSupplyLevel(totalSupply) {
  if (totalSupply >= 400) return 'HIGH'
  if (totalSupply >= 100) return 'MEDIUM'
  return 'LOW'
}

export function getPriceRange(crop, totalSupply) {
  const base = BASE_PRICES[crop]
  const level = getSupplyLevel(totalSupply)

  // Scale multiplier down as supply grows beyond thresholds (live demo effect)
  const glutFactor = totalSupply > 400 ? Math.min(1, 400 / totalSupply) : 1

  if (level === 'HIGH') {
    return {
      low: Math.round(base.low * 0.68 * glutFactor),
      high: Math.round(base.high * 0.72 * glutFactor),
    }
  }
  if (level === 'MEDIUM') {
    return {
      low: Math.round(base.low * 0.85),
      high: Math.round(base.high * 0.88),
    }
  }
  return { low: base.low, high: base.high }
}

export function getSupplyBadge(level) {
  if (level === 'HIGH') {
    return {
      text: '➘ Gluts forming - Buy Now',
      className: 'bg-red-50 text-red-700 border-red-200',
    }
  }
  if (level === 'LOW') {
    return {
      text: '➚ High Demand',
      className: 'bg-forest-50 text-forest-700 border-forest-200',
    }
  }
  return {
    text: '→ Stable Market',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  }
}

export function formatHarvestDate(daysFromNow) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toLocaleDateString('en-GH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
