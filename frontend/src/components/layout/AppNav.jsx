import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { IMAGES } from '../../data/images'

const PAGE_TITLES = {
  farmer: { title: 'Quick Harvest Log', sub: 'Log your crop in under 60 seconds' },
  buyer: { title: 'Buyer Command Center', sub: 'Live district supply & index pricing' },
  marketplace: { title: 'Equipment Marketplace', sub: 'Peer-to-peer tool rental' },
}

const TAB_ICONS = { farmer: '🌾', buyer: '📊', marketplace: '🚜' }
const TAB_LABELS = { farmer: 'Quick Log', buyer: 'Market Hub', marketplace: 'Equipment' }

export default function AppNav({ activeTab, onTabChange, allowedTabs, user }) {
  const { logout, roleConfig } = useAuth()
  const navigate = useNavigate()

  const meta = PAGE_TITLES[activeTab] ?? { title: 'AgroPulse', sub: '' }
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 shrink-0 z-30">
      <div className="flex items-center justify-between px-5 lg:px-6 h-14 lg:h-16 gap-4">
        {/* Left — page title (desktop) / logo (mobile) */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{meta.title}</h1>
          <p className="text-xs text-gray-400">{meta.sub}</p>
        </div>

        {/* Mobile: logo */}
        <Link to="/" className="flex lg:hidden items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="font-bold text-gray-900 text-base">AgroPulse</span>
        </Link>

        {/* Mobile: tab buttons */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto no-scrollbar">
          {allowedTabs.map((tabId) => (
            <button
              key={tabId}
              type="button"
              onClick={() => onTabChange(tabId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeTab === tabId
                  ? 'bg-forest-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{TAB_ICONS[tabId]}</span>
              <span className="hidden sm:inline">{TAB_LABELS[tabId]}</span>
            </button>
          ))}
        </div>

        {/* Right — user info + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400">{roleConfig?.label}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-forest-100 border-2 border-forest-200 flex items-center justify-center text-forest-700 font-bold text-sm shrink-0">
            {initial}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:block px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
