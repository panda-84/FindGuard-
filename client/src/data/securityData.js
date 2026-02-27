export const companies = [
  {
    id: 1,
    name: "Alpha Security",
    location: "Kathmandu",
    description: "Top rated security company",
    logo: null,
    guards: 3,
    availableGuards: [
      { id: 1, name: "Marcus Webb",   company: "Alpha Security", specialty: "Armed",   rating: 4.8, hourlyRate: 25, photo: null },
      { id: 2, name: "Priya Nair",    company: "Alpha Security", specialty: "Armed",   rating: 4.7, hourlyRate: 22, photo: null },
      { id: 3, name: "Carlos Mendez", company: "Alpha Security", specialty: "Patrol",  rating: 4.5, hourlyRate: 18, photo: null },
    ],
  },
  {
    id: 2,
    name: "Shield Guards",
    location: "Pokhara",
    description: "Professional armed guards",
    logo: null,
    guards: 2,
    availableGuards: [
      { id: 4, name: "Sarah Okonkwo", company: "Shield Guards", specialty: "Unarmed", rating: 4.9, hourlyRate: 20, photo: null },
      { id: 5, name: "James Tran",    company: "Shield Guards", specialty: "VIP",     rating: 4.6, hourlyRate: 30, photo: null },
    ],
  },
  {
    id: 3,
    name: "SafeGuard Nepal",
    location: "Lalitpur",
    description: "24/7 security services",
    logo: null,
    guards: 1,
    availableGuards: [
      { id: 6, name: "Aisha Farouq", company: "SafeGuard Nepal", specialty: "VIP", rating: 4.8, hourlyRate: 28, photo: null },
    ],
  },
];

export const allSecurities = companies.flatMap(c => c.availableGuards);
export const securities    = allSecurities;
export const allCompanies  = companies;