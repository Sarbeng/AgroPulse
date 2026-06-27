import { IMAGES } from '../../data/images'
import { CROP_META as CROP_SEED_META } from '../../data/seedData'

export default function DistrictCard({ district, cropData, onViewFarmers }) {
  const unit = CROP_SEED_META[cropData.crop]?.unit ?? 'Bags'
  const cropImage = IMAGES.crops[cropData.crop]

  const supplyPct = Math.min(100, ((cropData.totalSupply ?? 0) / 400) * 100)

  const levelColors = {
    HIGH: {
      bar: 'bg-red-500',
      badge: 'bg-red-50 text-red-700 border-red-200',
      pill: 'bg-red-500',
    },
    LOW: {
      bar: 'bg-forest-500',
      badge: 'bg-forest-50 text-forest-700 border-forest-200',
      pill: 'bg-forest-500',
    },
    MEDIUM: {
      bar: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      pill: 'bg-amber-500',
    },
  }

  const colors = levelColors[cropData.level] ?? levelColors.MEDIUM

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Crop image header */}
      <div className="h-36 overflow-hidden relative shrink-0">
        <img
          src={cropImage}
          alt={cropData.crop}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        {/* Level pill */}
        <span
          className={`absolute top-3 right-3 w-3 h-3 rounded-full ${colors.pill} ring-2 ring-white shadow-md`}
          title={cropData.level}
        />

        {/* District name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="text-lg font-bold text-white leading-tight">{district.name}</h3>
          <p className="text-xs text-white/70">{district.region} Region</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Price display */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
              {cropData.crop} · Index Price
            </p>
            <p className="text-2xl font-black text-gray-900">
              ₵{cropData.prices?.low}
              <span className="text-lg font-bold text-gray-400"> – ₵{cropData.prices?.high}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">per {unit.slice(0, -1).toLowerCase()}</p>
          </div>
          <span
            className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${colors.badge}`}
          >
            {cropData.level}
          </span>
        </div>

        {/* Supply bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-semibold text-gray-500">District Supply</p>
            <p className="text-xs font-bold text-gray-700">
              {cropData.totalSupply ?? 0} {unit.toLowerCase()}
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${colors.bar}`}
              style={{ width: `${supplyPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">0</span>
            <span className="text-xs text-gray-300">400+ bags</span>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`px-3 py-2.5 rounded-xl border text-sm font-semibold ${colors.badge}`}
        >
          {cropData.badge?.text ?? cropData.badge}
        </div>

        {/* CTA button */}
        <button
          type="button"
          onClick={() => onViewFarmers(district, cropData)}
          className="mt-auto w-full py-3 px-4 rounded-xl bg-forest-800 text-white text-sm font-bold hover:bg-forest-900 active:scale-[0.98] transition-all"
        >
          View{cropData.farmerCount > 0 ? ` ${cropData.farmerCount}` : ''} Farmer
          {cropData.farmerCount !== 1 ? 's' : ''} Harvesting Soon →
        </button>
      </div>
    </article>
  )
}
