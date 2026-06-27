import { CROP_META } from '../../data/seedData'

export default function VolumeStep({ crop, volume, onVolumeChange, onNext, onBack }) {
  const unit = CROP_META[crop]?.unit ?? 'Bags'

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-forest-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold text-forest-900 mb-1">
        Estimated {unit}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {crop} harvest volume
      </p>

      <div className="text-center mb-8">
        <span className="text-6xl font-bold text-forest-800 tabular-nums">
          {volume}
        </span>
        <span className="block text-lg text-gray-500 mt-1">{unit}</span>
      </div>

      <input
        type="range"
        min={1}
        max={500}
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="slider-thumb w-full mb-6"
      />

      <div className="flex justify-between text-xs text-gray-400 mb-8">
        <span>1</span>
        <span>500</span>
      </div>

      <div className="flex gap-2 mb-6">
        {[10, 50, 100, 500].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onVolumeChange(n)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
              volume === n
                ? 'bg-forest-700 text-white border-forest-700'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-forest-700 text-white text-lg font-semibold hover:bg-forest-800 active:scale-[0.98] transition-all"
      >
        Next →
      </button>
    </div>
  )
}
