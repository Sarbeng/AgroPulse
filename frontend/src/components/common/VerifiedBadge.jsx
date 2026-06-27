export default function VerifiedBadge({ small = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium text-forest-700 bg-forest-100 border border-forest-200 rounded-full ${
        small ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      }`}
    >
      ✓ Verified
    </span>
  )
}
