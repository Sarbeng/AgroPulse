import { useMemo, useState } from 'react'
import { useAgroPulse } from '../../context/useAgroPulse'
import { IMAGES } from '../../data/images'
import ToolCard from './ToolCard'
import ListToolModal from './ListToolModal'
import Modal from '../common/Modal'

export default function EquipmentMarketplace({ canList = true, canBook = true }) {
  const { equipment, addEquipment } = useAgroPulse()
  const [listOpen, setListOpen] = useState(false)
  const [bookedTool, setBookedTool] = useState(null)
  const [search, setSearch] = useState('')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const filtered = useMemo(() => {
    return equipment.filter((t) => {
      const matchesSearch =
        !search || t.name?.toLowerCase().includes(search.toLowerCase())
      const matchesAvail = !showAvailableOnly || t.is_available !== false
      return matchesSearch && matchesAvail
    })
  }, [equipment, search, showAvailableOnly])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Hero banner */}
      <div className="relative h-44 shrink-0">
        <img
          src={IMAGES.equipment.default}
          alt="Farm equipment"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-forest-950/85 via-forest-900/50 to-transparent flex items-end p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                Equipment Marketplace
              </h1>
              <p className="text-forest-200 mt-1 text-sm">
                Peer-to-peer tool rental — borrow from verified farmers in your district
              </p>
            </div>
            {canList && (
              <button
                type="button"
                onClick={() => setListOpen(true)}
                className="shrink-0 py-2.5 px-5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-md"
              >
                + List a Tool for Rent
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex flex-wrap gap-6 items-center">
          {[
            { label: 'Listed Tools', value: equipment.length },
            { label: 'Available Now', value: equipment.filter((t) => t.is_available !== false).length },
            { label: 'Avg. Daily Rate', value: equipment.length ? `₵${Math.round(equipment.reduce((s, t) => s + (t.pricePerDay || 0), 0) / equipment.length)}` : '—' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900">{s.value}</span>
              <span className="text-xs text-gray-400 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-gray-50"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            role="checkbox"
            aria-checked={showAvailableOnly}
            tabIndex={0}
            onClick={() => setShowAvailableOnly((v) => !v)}
            onKeyDown={(e) => e.key === 'Enter' && setShowAvailableOnly((v) => !v)}
            className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${
              showAvailableOnly ? 'bg-forest-600' : 'bg-gray-200'
            } relative`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                showAvailableOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">Available only</span>
        </label>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🚜</p>
            <p className="text-lg font-semibold text-gray-600">
              {search ? 'No tools match your search.' : 'No equipment listed yet.'}
            </p>
            {canList && !search && (
              <button
                type="button"
                onClick={() => setListOpen(true)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-bold hover:bg-forest-800 transition-colors"
              >
                Be the first to list a tool
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onBook={setBookedTool}
                canBook={canBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* List tool modal */}
      {canList && (
        <ListToolModal
          open={listOpen}
          onClose={() => setListOpen(false)}
          onSubmit={addEquipment}
        />
      )}

      {/* Booking confirmation modal */}
      <Modal
        open={!!bookedTool}
        onClose={() => setBookedTool(null)}
        title="Booking Confirmed 🎉"
      >
        {bookedTool && (
          <div className="text-center py-2">
            <img
              src={bookedTool.image ?? IMAGES.equipment.default}
              alt={bookedTool.name}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-1">{bookedTool.name}</h3>
            <p className="text-gray-500 text-sm mb-1">Owner: {bookedTool.owner}</p>
            <p className="text-3xl font-black text-forest-800 my-4">
              ₵{bookedTool.pricePerDay}
              <span className="text-base font-normal text-gray-400"> / day</span>
            </p>
            <div className="bg-forest-50 border border-forest-200 rounded-xl px-4 py-3 mb-5 text-sm text-forest-700">
              ✓ Booking request sent. The owner will contact you to arrange pickup.
            </div>
            <button
              type="button"
              onClick={() => setBookedTool(null)}
              className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
