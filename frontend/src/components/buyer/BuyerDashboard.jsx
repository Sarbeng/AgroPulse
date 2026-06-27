import { useEffect, useMemo, useState } from 'react'
import { useAgroPulse } from '../../context/useAgroPulse'
import { CROPS, REGIONS } from '../../data/seedData'
import DistrictCard from './DistrictCard'
import { FarmersListModal, CheckoutModal } from './OrderModals'
import VoiceChatbot from '../chat/VoiceChatbot'

function StatBox({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function BuyerDashboard() {
  const { loadMarketTrends, loadFarmers, isLive } = useAgroPulse()

  const [region, setRegion] = useState('Ashanti')
  const [crop, setCrop] = useState('Cassava')
  const [districtCards, setDistrictCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedCropData, setSelectedCropData] = useState(null)
  const [checkoutFarmer, setCheckoutFarmer] = useState(null)
  const [farmers, setFarmers] = useState([])
  const [farmersLoading, setFarmersLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    loadMarketTrends(region, crop).then((cards) => {
      setDistrictCards(cards ?? [])
      setLoading(false)
    })
  }, [region, crop, loadMarketTrends])

  useEffect(() => {
    if (!selectedDistrict || !selectedCropData) {
      setFarmers([])
      return
    }
    setFarmersLoading(true)
    loadFarmers(selectedDistrict.name, selectedCropData.crop).then((f) => {
      setFarmers(f)
      setFarmersLoading(false)
    })
  }, [selectedDistrict, selectedCropData, loadFarmers])

  const filteredCards = useMemo(() => {
    return districtCards
      .filter((d) => region === 'All' || d.region === region)
      .map((district) => {
        const cropData = district.crops.find((c) => c.crop === crop)
        return cropData ? { district, cropData } : null
      })
      .filter(Boolean)
  }, [districtCards, region, crop])

  const totalSupply = filteredCards.reduce((s, { cropData }) => s + (cropData.totalSupply ?? 0), 0)
  const highDemand = filteredCards.filter(({ cropData }) => cropData.level === 'LOW').length
  const glutForming = filteredCards.filter(({ cropData }) => cropData.level === 'HIGH').length

  return (
    <div className="flex h-full min-h-0">
      {/* ── Left filter panel ───────────────────────────────────────────── */}
      <aside className="hidden xl:flex flex-col w-72 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-5">Filters</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Region
              </label>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setRegion('All')}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    region === 'All'
                      ? 'bg-forest-700 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Regions
                </button>
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      region === r
                        ? 'bg-forest-700 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Crop
              </label>
              <div className="flex flex-col gap-1.5">
                {CROPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrop(c)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      crop === c
                        ? 'bg-amber-500 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Districts</span>
                <span className="text-sm font-bold text-gray-900">{filteredCards.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Supply</span>
                <span className="text-sm font-bold text-gray-900">{totalSupply} bags</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Demand</span>
                <span className="text-sm font-bold text-forest-700">{highDemand}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Glut Forming</span>
                <span className="text-sm font-bold text-red-600">{glutForming}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-amber-400'}`}
              />
              <span className="text-xs text-gray-500 font-medium">
                {isLive ? 'Live backend data' : 'Demo mode — start backend'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Mobile filters */}
        <div className="flex xl:hidden flex-wrap gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['All', ...REGIONS].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  region === r
                    ? 'bg-forest-700 text-white border-forest-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-forest-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {CROPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCrop(c)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  crop === c
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Stat boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox label="Districts" value={filteredCards.length} sub={region} />
          <StatBox label="Total Supply" value={`${totalSupply}`} sub="bags tracked" />
          <StatBox
            label="High Demand"
            value={highDemand}
            sub="↑ Buy now opportunities"
          />
          <StatBox
            label="Glut Forming"
            value={glutForming}
            sub="↓ Prices falling"
          />
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {crop} · {region === 'All' ? 'All Regions' : region}
            </h2>
            <p className="text-sm text-gray-400">
              Click a district card to view individual farmers
            </p>
          </div>
        </div>

        {/* District cards */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-4 border-4 border-gray-200 border-t-forest-600 rounded-full animate-spin" />
              Loading market data…
            </div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No districts match your filters.</p>
            <p className="text-sm mt-1">Try selecting a different region or crop.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCards.map(({ district, cropData }) => (
              <DistrictCard
                key={district.id}
                district={district}
                cropData={cropData}
                onViewFarmers={(d, cd) => {
                  setSelectedDistrict(d)
                  setSelectedCropData(cd)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <FarmersListModal
        open={!!selectedDistrict}
        onClose={() => {
          setSelectedDistrict(null)
          setSelectedCropData(null)
        }}
        district={selectedDistrict}
        cropData={selectedCropData}
        farmers={farmers}
        loading={farmersLoading}
        onSecureOrder={setCheckoutFarmer}
      />
      <CheckoutModal
        open={!!checkoutFarmer}
        farmer={checkoutFarmer}
        crop={selectedCropData?.crop}
        onClose={() => setCheckoutFarmer(null)}
      />

      <VoiceChatbot context="buyer" />
    </div>
  )
}
