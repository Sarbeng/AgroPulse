import { CROPS, REGIONS } from '../../data/seedData'

export default function FilterBar({ region, crop, onRegionChange, onCropChange }) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <label className="flex flex-col gap-1.5 min-w-40">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Region
        </span>
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          <option value="All">All Regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 min-w-40">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Crop
        </span>
        <select
          value={crop}
          onChange={(e) => onCropChange(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          {CROPS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
