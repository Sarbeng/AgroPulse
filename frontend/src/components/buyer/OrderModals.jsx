import { useState } from 'react'
import VerifiedBadge from '../common/VerifiedBadge'
import { formatHarvestDate } from '../../utils/pricing'
import { CROP_META } from '../../data/seedData'
import { api, tryApi } from '../../services/api'

export function CheckoutModal({ open, farmer, crop, onClose }) {
  const [stage, setStage] = useState('checkout')
  const unit = CROP_META[crop]?.unit ?? 'Bags'
  const unitSingular = unit.slice(0, -1)
  const pricePerUnit = 295
  const total = (farmer?.quantity ?? 0) * pricePerUnit

  const handlePay = async () => {
    setStage('loading')
    await tryApi(
      () => api.secureOrder({ harvest_log_id: farmer.harvest_log_id }),
      () => null,
    )
    setStage('success')
  }

  const handleClose = () => {
    setStage('checkout')
    onClose()
  }

  if (!open || !farmer) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        {stage === 'checkout' && (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Secure Order
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>
                Farmer: <strong>{farmer.name}</strong>
              </p>
              <p>
                Quantity:{' '}
                <strong>
                  {farmer.quantity} {unit}
                </strong>
              </p>
              <p>
                Price: <strong>₵{pricePerUnit}</strong> / {unitSingular}
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <p className="text-2xl font-bold text-forest-800">
                ₵{total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total in escrow</p>
            </div>
            <button
              type="button"
              onClick={handlePay}
              className="w-full py-4 rounded-xl bg-amber-500 text-white font-bold text-lg hover:bg-amber-600"
            >
              Pay with MoMo
            </button>
          </>
        )}

        {stage === 'loading' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-forest-200 border-t-forest-700 rounded-full animate-spin" />
            <p className="text-gray-600">Processing payment...</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-forest-900 mb-2">
              Order Secured!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ₵{total.toLocaleString()} locked in escrow. Farmer notified via
              SMS.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-forest-700 text-white font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function FarmersListModal({
  open,
  onClose,
  district,
  cropData,
  farmers,
  loading = false,
  onSecureOrder,
}) {
  const unit = CROP_META[cropData?.crop]?.unit ?? 'Bags'

  const openWhatsApp = (farmer) => {
    const msg = encodeURIComponent(
      `Hi ${farmer.name}, I saw your upcoming harvest on AgroPulse and want to buy your ${farmer.quantity} ${unit.toLowerCase()} of ${cropData.crop}. Can we discuss?`,
    )
    window.open(`https://wa.me/${farmer.phone.replace(/\D/g, '')}?text=${msg}`, '_blank')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {district?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {cropData?.crop} · {farmers.length} farmers harvesting soon
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-xl text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {loading && (
            <div className="flex items-center gap-3 p-8 justify-center text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-forest-600 rounded-full animate-spin" />
              <span className="text-sm">Loading farmers…</span>
            </div>
          )}
          {!loading && farmers.map((farmer) => (
            <div
              key={farmer.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 ${
                farmer.isNew ? 'bg-forest-50/50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">
                    {farmer.name}
                  </span>
                  {farmer.verified && <VerifiedBadge small />}
                  {farmer.isNew && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Just logged
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => openWhatsApp(farmer)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                    title={`Call ${farmer.phone}`}
                  >
                    📞
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {farmer.quantity} {unit} · Harvest{' '}
                  {formatHarvestDate(farmer.harvestDays)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSecureOrder(farmer)}
                className="shrink-0 py-2.5 px-5 rounded-lg bg-forest-700 text-white text-sm font-semibold hover:bg-forest-800"
              >
                Secure Order
              </button>
            </div>
          ))}

          {!loading && farmers.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              No farmers found for this district and crop.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
