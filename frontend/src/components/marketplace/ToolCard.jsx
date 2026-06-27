import { getEquipmentImage } from '../../data/images'
import VerifiedBadge from '../common/VerifiedBadge'

export default function ToolCard({ tool, onBook, canBook = true }) {
  const image = tool.image ?? getEquipmentImage(tool.name)

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="h-44 overflow-hidden relative shrink-0">
        <img
          src={image}
          alt={tool.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        {tool.verified && (
          <span className="absolute top-3 left-3">
            <VerifiedBadge small />
          </span>
        )}
        <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm">
          ₵{tool.pricePerDay} / day
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{tool.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            {tool.owner}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                tool.condition === 'Excellent'
                  ? 'bg-forest-50 text-forest-700 border-forest-200'
                  : tool.condition === 'Good'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {tool.condition ?? 'Good'}
            </span>
          </div>
          <p className="text-xl font-black text-forest-800">
            ₵{tool.pricePerDay}
            <span className="text-xs font-normal text-gray-400"> /day</span>
          </p>
        </div>

        {canBook && (
          <button
            type="button"
            onClick={() => onBook(tool)}
            className="mt-auto w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 active:scale-[0.98] transition-all"
          >
            Instant Book
          </button>
        )}
      </div>
    </article>
  )
}
