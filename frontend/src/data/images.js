export const IMAGES = {
  hero: '/images/hero.jpg',
  authBg: '/images/auth-bg.jpg',
  landingFarmers: '/images/landing-farmers.jpg',
  landingMarket: '/images/landing-market.jpg',
  crops: {
    Cassava: '/images/cassava.jpg',
    Maize: '/images/maize.jpg',
    Yam: '/images/yam.jpg',
    Tomato: '/images/tomato.jpg',
  },
  equipment: {
    'Tractor Attachment': '/images/tractor.jpg',
    'Power Tiller': '/images/tiller.jpg',
    'Mechanical Cassava Peeler': '/images/peeler.jpg',
    'Irrigation Pump': '/images/pump.jpg',
    default: '/images/tractor.jpg',
  },
}

export function getEquipmentImage(name) {
  return IMAGES.equipment[name] ?? IMAGES.equipment.default
}
