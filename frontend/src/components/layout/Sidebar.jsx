import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const TAB_META = {
  farmer: {
    icon: '🌾',
    label: 'Quick Log',
    desc: 'Log your harvest',
  },
  buyer: {
    icon: '📊',
    label: 'Market Hub',
    desc: 'Live district pricing',
  },
  marketplace: {
    icon: '🚜',
    label: 'Equipment',
    desc: 'Rent & lend tools',
  },
}

export default function Sidebar({ activeTab, onTabChange, allowedTabs }) {
  const { user, roleConfig, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'

  return (
    <aside className="w-64 shrink-0 bg-forest-950 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-forest-900/60">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-md group-hover:bg-amber-400 transition-colors">
            <span className="text-white font-black text-base">A</span>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">AgroPulse</p>
            <p className="text-forest-400 text-xs">Ghana · Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Role pill */}
      <div className="mx-4 mt-4 px-3 py-2.5 rounded-xl bg-forest-900/50 border border-forest-800">
        <p className="text-forest-500 text-xs uppercase tracking-wider font-semibold">Logged in as</p>
        <p className="text-white font-semibold text-sm mt-0.5">{roleConfig?.label ?? 'User'}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-forest-600 text-xs uppercase tracking-widest font-bold px-3 mb-3">
          Navigation
        </p>
        {allowedTabs.map((tabId) => {
          const meta = TAB_META[tabId]
          if (!meta) return null
          const isActive = activeTab === tabId
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => onTabChange(tabId)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/30'
                  : 'text-forest-300 hover:bg-forest-900 hover:text-white'
              }`}
            >
              <span className="text-xl shrink-0">{meta.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{meta.label}</p>
                <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-amber-100' : 'text-forest-600'}`}>
                  {meta.desc}
                </p>
              </div>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Help hint */}
      <div className="mx-4 mb-4 px-3.5 py-3 rounded-xl bg-forest-900/50 border border-forest-800/50">
        <p className="text-forest-400 text-xs leading-relaxed">
          <strong className="text-forest-200">Hackathon Demo</strong>
          {' '}— Try logging 500 bags to trigger the glut pricing flip!
        </p>
      </div>

      {/* User + logout */}
      <div className="p-4 border-t border-forest-900/60">
        <div className="flex items-center gap-3 mb-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name ?? 'User'}</p>
            <p className="text-forest-500 text-xs truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2 rounded-lg text-sm text-forest-400 hover:text-white hover:bg-forest-900 transition-colors text-center font-medium"
        >
          Sign Out →
        </button>
      </div>
    </aside>
  )
}
