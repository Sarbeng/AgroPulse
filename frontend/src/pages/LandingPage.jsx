import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CROP_META, CROPS } from '../data/seedData'
import { IMAGES } from '../data/images'

const ROLES = [
  {
    icon: '🌾',
    title: 'Farmers',
    desc: 'Log harvests in 60 seconds. Get discovered by verified buyers across Ghana.',
    color: 'bg-forest-50 border-forest-200',
    tag: 'For Farmers',
  },
  {
    icon: '📊',
    title: 'Buyers & Traders',
    desc: 'Access live district supply data, index pricing, and secure orders via Mobile Money.',
    color: 'bg-amber-50 border-amber-200',
    tag: 'For Buyers',
  },
  {
    icon: '🚜',
    title: 'Equipment Owners',
    desc: 'List your tractor, tiller or peeler for rent. Earn daily from idle equipment.',
    color: 'bg-blue-50 border-blue-200',
    tag: 'For Lenders',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up in under 60 seconds. Choose your role — farmer, buyer, or equipment provider.',
    img: IMAGES.authBg,
  },
  {
    step: '02',
    title: 'Log or Browse Harvests',
    desc: 'Farmers log crop volume and timeline. Buyers see live supply and index prices per district.',
    img: IMAGES.landingFarmers,
  },
  {
    step: '03',
    title: 'Trade & Earn',
    desc: 'Secure orders with MoMo escrow. Rent equipment peer-to-peer. Repeat.',
    img: IMAGES.landingMarket,
  },
]

const FEATURES = [
  { icon: '⚡', title: '60-Second Logging', desc: 'Farmers submit harvest volume and timeline in three taps.' },
  { icon: '💹', title: 'Dynamic Pricing', desc: 'Index prices shift in real time based on district supply and demand.' },
  { icon: '🔐', title: 'MoMo Escrow', desc: 'Funds are locked until delivery is confirmed — no trust issues.' },
  { icon: '✅', title: 'MoFA Verified', desc: 'Government IDs and coop numbers verify genuine district farmers.' },
  { icon: '🛠️', title: 'P2P Equipment Rental', desc: 'Rent tractors, sprayers, and peelers from farmers in your district.' },
  { icon: '📍', title: 'District-Level Intel', desc: 'Granular supply data per district and crop type — not national averages.' },
]

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Live
    </span>
  )
}

function SignInModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sign In to Purchase</h3>
        <p className="text-gray-500 mb-6">
          Create a free account or log in to secure crop orders and browse farmer listings on AgroPulse Ghana.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/auth?mode=signup"
            className="w-full py-3.5 rounded-xl bg-forest-700 text-white font-bold text-base hover:bg-forest-800 transition-colors"
          >
            Create Free Account
          </Link>
          <Link
            to="/auth?mode=login"
            className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [livePrices, setLivePrices] = useState({})
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [activeCrop, setActiveCrop] = useState('Cassava')
  const [showSignIn, setShowSignIn] = useState(false)
  const [liveEquipment, setLiveEquipment] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const featuresRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fetch live prices for all crops from the backend
  useEffect(() => {
    Promise.all(
      CROPS.map((crop) =>
        fetch(`/api/market-trends?crop=${crop}`)
          .then((r) => r.json())
          .then((data) => ({ crop, data }))
          .catch(() => ({ crop, data: [] })),
      ),
    ).then((results) => {
      const map = {}
      results.forEach(({ crop, data }) => {
        map[crop] = Array.isArray(data) ? data : []
      })
      setLivePrices(map)
      setLoadingPrices(false)
    })

    fetch('/api/equipment')
      .then((r) => r.json())
      .then((data) => setLiveEquipment(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
  }, [])

  const currentRows = livePrices[activeCrop] ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky Nav ──────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center">
                <span className="text-white font-black text-base">A</span>
              </div>
              <span
                className={`font-bold text-lg transition-colors ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                AgroPulse{' '}
                <span className={scrolled ? 'text-forest-700' : 'text-forest-300'}>Ghana</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {['Features', 'How It Works', 'Marketplace'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                    scrolled ? 'text-gray-600' : 'text-white/80'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/auth?mode=login"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-5 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center -mt-16">
        <img
          src={IMAGES.hero}
          alt="Ghana farmland at sunrise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/92 via-forest-900/75 to-forest-900/30" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-5">
              Ghana Agricultural Marketplace
            </span>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] mb-6">
              Real-Time Harvest Data.
              <br />
              <span className="text-amber-400">Smarter Trade.</span>
            </h1>
            <p className="text-xl text-forest-100 mb-10 leading-relaxed max-w-2xl">
              AgroPulse connects district harvest logs to live index pricing — so
              farmers earn more and buyers source smarter, right across Ghana.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/auth?mode=signup"
                className="px-8 py-4 rounded-xl bg-amber-500 text-white font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-900/30"
              >
                Start for Free
              </Link>
              <a
                href="#marketplace"
                className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
              >
                View Live Prices ↓
              </a>
            </div>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="hidden lg:flex absolute right-8 bottom-16 gap-4">
          {[
            { value: '3', label: 'Districts' },
            { value: '22+', label: 'Verified Farmers' },
            { value: '₵', label: 'Live Index' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 text-center min-w-[90px]"
            >
              <p className="text-2xl font-black text-amber-400">{s.value}</p>
              <p className="text-xs text-white/70 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Live Marketplace Preview ──────────────────────────────────────── */}
      <section id="marketplace" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <LiveBadge />
                <span className="text-sm text-gray-500">Prices update with every new harvest log</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Live Market Prices
              </h2>
              <p className="text-gray-500 mt-2">
                Browse current district supply and index prices. Sign in to buy directly from farmers.
              </p>
            </div>

            {/* Crop tabs */}
            <div className="flex flex-wrap gap-2">
              {CROPS.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setActiveCrop(crop)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    activeCrop === crop
                      ? 'bg-forest-700 text-white border-forest-700 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-forest-300 hover:text-forest-700'
                  }`}
                >
                  <span>{CROP_META[crop]?.emoji}</span>
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Price table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {loadingPrices ? (
              <div className="py-20 text-center text-gray-400">
                <div className="w-8 h-8 mx-auto mb-3 border-4 border-gray-200 border-t-forest-600 rounded-full animate-spin" />
                Loading live prices…
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['District', 'Region', 'Supply Available', 'Index Price / Bag', 'Market Status', 'Action'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-400">
                        No data yet for {activeCrop} — be the first farmer to log a harvest!
                      </td>
                    </tr>
                  ) : (
                    currentRows.map((row) => (
                      <tr key={row.district} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">{row.district}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-sm">{row.region}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  row.level === 'HIGH'
                                    ? 'bg-red-500'
                                    : row.level === 'LOW'
                                      ? 'bg-forest-500'
                                      : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, (row.totalSupply / 400) * 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-700 font-medium tabular-nums">
                              {row.totalSupply} bags
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-lg font-bold text-forest-800">
                            ₵{row.prices?.low} – ₵{row.prices?.high}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                              row.level === 'HIGH'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : row.level === 'LOW'
                                  ? 'bg-forest-50 text-forest-700 border-forest-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {row.badge}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setShowSignIn(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors group-hover:shadow-sm"
                          >
                            🔒 Buy Now
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {currentRows.length} district{currentRows.length !== 1 ? 's' : ''} for{' '}
                <strong>{activeCrop}</strong>
              </p>
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors"
              >
                Sign in to access full marketplace →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From farm gate to buyer's account in three simple steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-8 border-t-2 border-dashed border-gray-200 -translate-x-4 z-10" />
                )}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-forest-950/50" />
                    <span className="absolute top-4 left-4 text-5xl font-black text-white/30 select-none">
                      {step.step}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles / For Everyone ──────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Role in the Value Chain
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              One platform, three types of users — each with a tailored experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className={`rounded-2xl border p-8 ${role.color} hover:shadow-md transition-shadow`}
              >
                <div className="text-4xl mb-4">{role.icon}</div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                  {role.tag}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{role.desc}</p>
                <Link
                  to="/auth?mode=signup"
                  className="inline-block px-5 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-semibold hover:bg-forest-800 transition-colors"
                >
                  Join as {role.title.split(' ')[0]} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Trade Smarter
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-forest-300 hover:shadow-sm transition-all group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Crops Showcase ────────────────────────────────────────────────── */}
      <section className="py-24 bg-forest-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Ghana&apos;s Key Crops
            </h2>
            <p className="text-forest-300">
              Cassava, Maize, Yam, and Tomato — tracked with live district supply data.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CROPS.map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setShowSignIn(true)}
                className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <img
                  src={IMAGES.crops[crop]}
                  alt={crop}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-900/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-2xl mb-1">{CROP_META[crop]?.emoji}</span>
                  <span className="text-white font-bold text-lg">{crop}</span>
                  <span className="text-forest-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view prices →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipment Preview ─────────────────────────────────────────────── */}
      {liveEquipment.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Equipment Marketplace</h2>
                <p className="text-gray-500">Rent from verified farmers in your district.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="text-sm font-semibold text-forest-700 hover:text-forest-900"
              >
                Browse all equipment →
              </button>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {liveEquipment.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={IMAGES.equipment[tool.tool_name] ?? IMAGES.equipment.default}
                      alt={tool.tool_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{tool.tool_name}</h3>
                    <p className="text-sm text-gray-500 mb-3">Owner: {tool.user?.name ?? 'Verified Farmer'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-forest-800">
                        ₵{parseFloat(tool.daily_rate_cedis).toFixed(0)}
                        <span className="text-sm font-normal text-gray-500"> / day</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSignIn(true)}
                        className="px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors"
                      >
                        🔒 Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-28 bg-forest-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">
            Ready to Transform Your Harvest?
          </h2>
          <p className="text-forest-200 text-lg mb-10 max-w-xl mx-auto">
            Join farmers and buyers already using AgroPulse to trade smarter across Ghana&apos;s agricultural districts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/auth?mode=signup"
              className="px-10 py-4 rounded-xl bg-amber-500 text-white font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              View Live Prices
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">A</span>
              </div>
              <span className="text-white font-bold">AgroPulse Ghana</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link to="/auth?mode=signup" className="hover:text-white transition-colors">Sign Up</Link>
              <Link to="/auth?mode=login" className="hover:text-white transition-colors">Log In</Link>
              <a href="#marketplace" className="hover:text-white transition-colors">Live Prices</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 AgroPulse Ghana · Hackathon Demo
            </p>
          </div>
        </div>
      </footer>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </div>
  )
}
