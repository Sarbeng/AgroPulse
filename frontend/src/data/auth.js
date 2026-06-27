export const USER_ROLES = {
  farmer: {
    id: 'farmer',
    label: 'Farmer',
    description: 'Log harvests and connect with buyers',
    defaultTab: 'farmer',
    tabs: ['farmer', 'marketplace'],
    canListEquipment: false,
    canBookEquipment: true,
  },
  buyer: {
    id: 'buyer',
    label: 'Buyer',
    description: 'Access district pricing and secure orders',
    defaultTab: 'buyer',
    tabs: ['buyer'],
    canListEquipment: false,
    canBookEquipment: false,
  },
  equipment_renter: {
    id: 'equipment_renter',
    label: 'Equipment Renter',
    description: 'Rent tools from fellow farmers',
    defaultTab: 'marketplace',
    tabs: ['marketplace'],
    canListEquipment: false,
    canBookEquipment: true,
  },
  equipment_lender: {
    id: 'equipment_lender',
    label: 'Equipment Lender / Seller',
    description: 'List and rent out your farm equipment',
    defaultTab: 'marketplace',
    tabs: ['marketplace'],
    canListEquipment: true,
    canBookEquipment: true,
  },
}

export const ROLE_LIST = Object.values(USER_ROLES)

const STORAGE_KEY = 'agropulse_user'

export function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
}
