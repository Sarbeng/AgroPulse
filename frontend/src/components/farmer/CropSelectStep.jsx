import { CROPS } from '../../data/seedData'
import { IMAGES } from '../../data/images'

export default function CropSelectStep({ onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-forest-900 mb-1">Select Crop</h2>
      <p className="text-sm text-gray-500 mb-5">Tap your crop to continue</p>

      <div className="grid grid-cols-2 gap-3">
        {CROPS.map((crop) => (
          <button
            key={crop}
            type="button"
            onClick={() => onSelect(crop)}
            className="relative flex flex-col items-center justify-end gap-2 p-2 rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-forest-500 hover:scale-[1.02] active:scale-95 transition-all shadow-sm min-h-[140px] group"
          >
            <img
              src={IMAGES.crops[crop]}
              alt={crop}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-900/20 to-transparent" />
            <span className="relative text-base font-bold text-white drop-shadow-md pb-3">
              {crop}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
