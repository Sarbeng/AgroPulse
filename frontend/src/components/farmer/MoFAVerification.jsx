import { FARMER_DISTRICTS, MOFA_VALID_IDS } from '../../data/seedData'

export default function MoFAVerification({
  mofaId,
  onMofaIdChange,
  district,
  onDistrictChange,
  farmerName,
  onFarmerNameChange,
}) {
  const isVerified = MOFA_VALID_IDS.includes(mofaId.trim().toUpperCase())

  return (
    <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-forest-800 mb-3">
        MoFA Verification
      </h3>

      <label className="block mb-3">
        <span className="text-xs text-gray-500 mb-1 block">
          Your Name
        </span>
        <input
          type="text"
          value={farmerName}
          onChange={(e) => onFarmerNameChange(e.target.value)}
          placeholder="e.g. Kwame Mensah"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
        />
      </label>

      <label className="block mb-3">
        <span className="text-xs text-gray-500 mb-1 block">
          District
        </span>
        <select
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          {FARMER_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-gray-500 mb-1 block">
          MoFA ID / District Cooperative Number
        </span>
        <input
          type="text"
          value={mofaId}
          onChange={(e) => onMofaIdChange(e.target.value)}
          placeholder="MOFA-2026-TEST"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
        />
      </label>

      {isVerified && (
        <div className="mt-3 pulse-verified inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-600 text-white text-sm font-semibold">
          ✓ Verified District Farmer
        </div>
      )}

      {!isVerified && mofaId.length > 3 && (
        <p className="mt-2 text-xs text-gray-400">
          Demo: try MOFA-2026-TEST or COOP-77
        </p>
      )}
    </div>
  )
}
