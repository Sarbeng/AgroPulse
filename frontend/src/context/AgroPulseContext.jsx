import { useCallback, useEffect, useState } from 'react'
import { api, tryApi } from '../services/api'
import { DISTRICTS } from '../data/seedData'
import { getSupplyLevel, getPriceRange, getSupplyBadge } from '../utils/pricing'
import { AgroPulseContext } from './useAgroPulse'

// Maps TIMELINES id values (from seedData) to backend enum strings
const TIMELINE_MAP = {
  'this-week': 'this_week',
  'two-weeks': '2_weeks',
  'one-month': '1_month',
}

function transformEquipment(items) {
  return items.map((item) => ({
    id: item.id,
    name: item.tool_name ?? item.name,
    owner: item.user?.name ?? 'Unknown',
    verified: item.user?.is_verified ?? false,
    pricePerDay: parseFloat(item.daily_rate_cedis ?? item.pricePerDay ?? 0),
    condition: 'Good',
    image: null,
  }))
}

// Build district cards from local DISTRICTS as a fallback when the API is down
function buildLocalCards(region, crop) {
  return DISTRICTS.filter(
    (d) => !region || region === 'All' || d.region === region,
  ).map((d) => {
    const supply = d.cropSupplies[crop] ?? { baseSupply: 0, farmers: 0 }
    const totalSupply = supply.baseSupply
    const level = getSupplyLevel(totalSupply)
    const prices = getPriceRange(crop, totalSupply)
    const badge = getSupplyBadge(level)
    return {
      id: d.id,
      name: d.name,
      region: d.region,
      crops: [{ crop, totalSupply, level, prices, badge, farmerCount: supply.farmers }],
    }
  })
}

// Convert the backend's badge string + level into the {text, className} shape
// that DistrictCard expects.
function badgeFromBackend(level, text) {
  if (level === 'HIGH')
    return { text, className: 'bg-red-50 text-red-700 border-red-200' }
  if (level === 'LOW')
    return { text, className: 'bg-forest-50 text-forest-700 border-forest-200' }
  return { text, className: 'bg-amber-50 text-amber-700 border-amber-200' }
}

export function AgroPulseProvider({ children }) {
  const [equipment, setEquipment] = useState([])
  const [isLive, setIsLive] = useState(false)

  // Load equipment from backend on mount
  useEffect(() => {
    tryApi(() => api.getEquipment(), () => null).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setEquipment(transformEquipment(data))
        setIsLive(true)
      }
    })
  }, [])

  /**
   * Fetch market trends for the given region + crop from the backend.
   * Returns an array of district cards in the shape expected by BuyerDashboard.
   * Falls back to local static data if the API is unreachable.
   */
  const loadMarketTrends = useCallback(async (region, crop) => {
    const data = await tryApi(
      () => api.marketTrends(region, crop),
      () => null,
    )

    if (!Array.isArray(data) || data.length === 0) {
      return buildLocalCards(region, crop)
    }

    setIsLive(true)

    // Group flat list (one row per district) into district card objects
    const byDistrict = {}
    data.forEach((item) => {
      const slug = item.district.toLowerCase().replace(/[\s-]+/g, '-')
      if (!byDistrict[slug]) {
        byDistrict[slug] = {
          id: slug,
          name: item.district,
          region: item.region,
          crops: [],
        }
      }
      byDistrict[slug].crops.push({
        crop: item.crop,
        totalSupply: item.totalSupply,
        level: item.level,
        prices: item.prices,
        badge: badgeFromBackend(item.level, item.badge),
        farmerCount: item.farmerCount ?? 0,
      })
    })

    return Object.values(byDistrict)
  }, [])

  /**
   * Fetch farmers for a specific district + crop from the backend.
   * Returns a flat array shaped for FarmersListModal.
   */
  const loadFarmers = useCallback(async (districtName, crop) => {
    return tryApi(
      () => api.districtFarmers(districtName, crop),
      () => [],
    )
  }, [])

  /**
   * Register the farmer (or find existing by phone) then create a harvest log.
   * Handles the two-step backend flow transparently.
   */
  const submitHarvest = useCallback(async (payload) => {
    // Use a timestamp-based phone so each anonymous farmer gets a unique record
    const phone =
      payload.phone || `+233${Math.floor(Date.now() / 1000) % 1000000000}`

    const farmerResult = await tryApi(
      () =>
        api.registerFarmer({
          name: payload.farmerName || 'Anonymous Farmer',
          phone_number: phone,
          mofa_id: payload.mofaId || null,
          district: payload.district,
        }),
      () => null,
    )

    if (!farmerResult?.id) {
      // Backend unreachable — return a local stub so the wizard still finishes
      return { id: `local-${Date.now()}`, ...payload }
    }

    const timelineEnum = TIMELINE_MAP[payload.timelineId] ?? 'this_week'

    return tryApi(
      () =>
        api.createHarvest({
          user_id: farmerResult.id,
          crop_type: payload.crop,
          volume_bags: payload.volume,
          timeline: timelineEnum,
          district: payload.district,
        }),
      () => ({ id: `local-${Date.now()}`, ...payload }),
    )
  }, [])

  /**
   * List a tool for rent.  Calls the backend then prepends the item to local
   * state so the marketplace updates immediately without a refresh.
   */
  const addEquipment = useCallback(async (listing) => {
    // Try to use the farmer's backend ID if they registered this session
    const stored = JSON.parse(
      localStorage.getItem('agropulse_backend_user') || 'null',
    )
    const userId = stored?.id ?? 1

    const result = await tryApi(
      () =>
        api.createEquipment({
          user_id: userId,
          tool_name: listing.name,
          daily_rate_cedis: listing.pricePerDay,
          is_available: true,
        }),
      () => null,
    )

    const item = {
      id: result?.id ?? `e-${Date.now()}`,
      name: listing.name,
      owner: listing.owner ?? 'You',
      verified: false,
      pricePerDay: listing.pricePerDay,
      condition: listing.condition ?? 'Good',
      image: null,
    }

    setEquipment((prev) => [item, ...prev])
    return item
  }, [])

  const value = {
    equipment,
    isLive,
    loadMarketTrends,
    loadFarmers,
    submitHarvest,
    addEquipment,
  }

  return (
    <AgroPulseContext.Provider value={value}>
      {children}
    </AgroPulseContext.Provider>
  )
}
