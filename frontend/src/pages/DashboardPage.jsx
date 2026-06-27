import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Sidebar from '../components/layout/Sidebar'
import AppNav from '../components/layout/AppNav'
import FarmerView from '../components/farmer/FarmerView'
import BuyerDashboard from '../components/buyer/BuyerDashboard'
import EquipmentMarketplace from '../components/marketplace/EquipmentMarketplace'

export default function DashboardPage() {
  const { user, roleConfig } = useAuth()
  const allowedTabs = roleConfig?.tabs ?? []
  const [activeTab, setActiveTab] = useState(
    () => roleConfig?.defaultTab ?? allowedTabs[0] ?? 'farmer',
  )

  if (!user || !roleConfig) {
    return <Navigate to="/auth" replace />
  }

  const currentTab = allowedTabs.includes(activeTab) ? activeTab : roleConfig.defaultTab

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={currentTab}
          onTabChange={setActiveTab}
          allowedTabs={allowedTabs}
        />
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav bar (visible always, contains mobile tabs) */}
        <AppNav
          activeTab={currentTab}
          onTabChange={setActiveTab}
          allowedTabs={allowedTabs}
          user={user}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'farmer' && allowedTabs.includes('farmer') && (
            <FarmerView />
          )}
          {currentTab === 'buyer' && allowedTabs.includes('buyer') && (
            <BuyerDashboard />
          )}
          {currentTab === 'marketplace' && allowedTabs.includes('marketplace') && (
            <EquipmentMarketplace
              canList={roleConfig.canListEquipment}
              canBook={roleConfig.canBookEquipment}
            />
          )}
        </main>

        <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-200 bg-white shrink-0">
          AgroPulse Ghana · {roleConfig.label} Portal · Hackathon Demo
        </footer>
      </div>
    </div>
  )
}
