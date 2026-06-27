import { TIMELINES } from '../../data/seedData'

export default function TimelineStep({
  crop,
  volume,
  onSubmit,
  onBack,
  submitting,
}) {
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
        When is harvest?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {volume} bags of {crop}
      </p>

      <div className="flex flex-col gap-3">
        {TIMELINES.map((timeline) => (
          <button
            key={timeline.id}
            type="button"
            disabled={submitting}
            onClick={() => onSubmit(timeline)}
            className="w-full py-5 px-5 rounded-2xl bg-white border-2 border-forest-200 text-left hover:border-forest-500 hover:bg-forest-50 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span className="text-lg font-semibold text-forest-900">
              {timeline.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
