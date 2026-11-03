// A/B share the unresolved system coordinates at this map's resolution.
// Adopted luminosities/companion temperature follow the existing H–R data.
export const ETA_CARINAE_STARS = [
  {
    name: 'Eta Carinae A', ra: 161.265, dec: -59.684167, distance: 7500,
    constellation: 'Carina', spectralClass: 'LBV', luminosity: 4600000,
    magnitude: 'Unresolved variable system', etaCarinaeComponent: 'A',
    description: 'The luminous blue variable primary of Eta Carinae, inside the Homunculus Nebula. Temperature and apparent radius depend strongly on its dense stellar wind and are not fixed here. A and B share the system position: their true separation is far below the map scale. The close-view markers are enlarged and separated for navigation.'
  },
  {
    name: 'Eta Carinae B', ra: 161.265, dec: -59.684167, distance: 7500,
    constellation: 'Carina', spectralClass: 'O or WR', temperature: 37200,
    luminosity: 1000000, magnitude: 'Unresolved variable system', etaCarinaeComponent: 'B',
    description: 'The hot, massive companion of Eta Carinae A, embedded in the Homunculus Nebula. The adopted temperature and luminosity are approximate and model-dependent. A and B share the system position at this map scale; the close-view markers are deliberately enlarged and separated for navigation.'
  }
];
