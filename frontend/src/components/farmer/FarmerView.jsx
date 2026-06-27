import { useEffect, useState } from 'react'
import { IMAGES } from '../../data/images'
import { api, tryApi } from '../../services/api'
import QuickLogWizard from './QuickLogWizard'
import VoiceChatbot from '../chat/VoiceChatbot'

function MarketStatusPanel({ district, crop }) {
  const [districtData, setDistrictData] = useState(null)
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!district || !crop) return
    setLoading(true)

    Promise.all([
      tryApi(() => api.marketTrends(null, crop), () => null),
      tryApi(() => api.districtFarmers(district, crop), () => []),
    ]).then(([trendsData, farmersData]) => {
      if (Array.isArray(trendsData)) {
        const match = trendsData.find((d) => d.district === district)
        setDistrictData(match ?? null)
      }
      if (Array.isArray(farmersData)) {
        setRecentLogs(farmersData.slice(0, 6))
      }
      setLoading(false)
    })
  }, [district, crop])

  const levelColor = {
    HIGH: 'text-red-600 bg-red-50 border-red-200',
    LOW: 'text-forest-700 bg-forest-50 border-forest-200',
    MEDIUM: 'text-amber-700 bg-amber-50 border-amber-200',
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* District market status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
          {district} · {crop} Market
        </h3>

        {loading ? (
          <div className="flex items-center gap-3 py-4 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-forest-600 rounded-full animate-spin" />
            <span className="text-sm">Fetching market data…</span>
          </div>
        ) : districtData ? (
          <div className="space-y-4">
            {/* Price */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Current Index Price / Bag</p>
              <p className="text-3xl font-black text-gray-900">
                ₵{districtData.prices?.low}
                <span className="text-xl font-bold text-gray-400">
                  {' '}– ₵{districtData.prices?.high}
                </span>
              </p>
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold ${
                levelColor[districtData.level] ?? levelColor.MEDIUM
              }`}
            >
              {districtData.badge}
            </span>

            {/* Supply bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 font-medium">District Supply</span>
                <span className="text-xs font-bold text-gray-700">
                  {districtData.totalSupply} bags
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    districtData.level === 'HIGH'
                      ? 'bg-red-500'
                      : districtData.level === 'LOW'
                        ? 'bg-forest-500'
                        : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (districtData.totalSupply / 400) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                &gt;300 bags triggers "Glut forming" — prices drop ~20%
              </p>
            </div>

            {/* Farmer count */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Active Farmers</span>
              <span className="text-sm font-bold text-gray-800">
                {districtData.farmerCount} in {district}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-4">
            No market data for {district} yet — your harvest will be the first!
          </p>
        )}
      </div>

      {/* Recent logs */}
      <div className="bg-white rounded-2xl border border-gray-200 flex-1 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Recent Logs · {district}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Farmers harvesting {crop} soon</p>
        </div>

        <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center gap-3 p-5 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-forest-600 rounded-full animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : recentLogs.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No recent logs for this crop yet.</p>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-sm shrink-0">
                  {log.name?.[0]?.toUpperCase() ?? 'F'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {log.name}
                    {log.verified && (
                      <span className="ml-1.5 text-xs font-normal text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded-full border border-forest-200">
                        ✓ Verified
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {log.quantity} bags · in {log.harvestDays} days
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-amber-800 mb-1">💡 Demo Tip</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Log <strong>500 bags</strong> to watch {district}&apos;s price index drop in real time — that&apos;s the glut engine at work.
        </p>
      </div>
    </div>
  )
}

export default function FarmerView() {
  const [currentCrop, setCurrentCrop] = useState('Cassava')
  const [currentDistrict, setCurrentDistrict] = useState('Techiman')

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 overflow-hidden">
      {/* ── Left: wizard ──────────────────────────────────────────────────── */}
      <div className="lg:w-[420px] xl:w-[460px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white overflow-y-auto">
        {/* Hero strip */}
        <div className="relative h-32 shrink-0">
          <img
            src={IMAGES.landingFarmers}
            alt="Ghana farmer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-forest-900/80 to-forest-900/20 flex items-end p-5">
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Quick Harvest Log</h2>
              <p className="text-xs text-forest-200 mt-0.5">Log your crop in under 60 seconds</p>
            </div>
          </div>
        </div>

        {/* Wizard */}
        <div className="p-5 lg:p-6">
          <QuickLogWizard
            onCropChange={setCurrentCrop}
            onDistrictChange={setCurrentDistrict}
          />
        </div>
      </div>

      {/* ── Right: market status ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 bg-gray-50">
        <div className="max-w-xl mx-auto lg:max-w-none h-full">
          <MarketStatusPanel district={currentDistrict} crop={currentCrop} />
        </div>
      </div>

      <VoiceChatbot context="farmer" />
    </div>
  )
}
