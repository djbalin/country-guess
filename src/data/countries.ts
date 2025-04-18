// Country data from Worldometers (https://www.worldometers.info/world-population/population-by-country/)
// Data represents 2025 projections according to the United Nations Population Division

export type Country = {
  name: string;
  code: string;
  population: number;
  yearlyChange: number; // percentage
  density: number; // people per km²
  landArea: number; // km²
  migrants: number; // net
  fertilityRate: number;
  medianAge: number;
  urbanPopulationPercent: number;
}

export type GameMetric = {
  id: string;
  name: string;
  description: string;
  valueFormatter: (value: number) => string;
  higherIsBetter: boolean;
  accessor: (country: Country) => number;
}

export const countries: Country[] = [
  { name: 'India', code: 'IN', population: 1463865525, yearlyChange: 0.89, density: 492, landArea: 2973190, migrants: -495753, fertilityRate: 1.94, medianAge: 28.8, urbanPopulationPercent: 37.1 },
  { name: 'China', code: 'CN', population: 1416096094, yearlyChange: -0.23, density: 151, landArea: 9388211, migrants: -268126, fertilityRate: 1.02, medianAge: 40.1, urbanPopulationPercent: 67.5 },
  { name: 'United States', code: 'US', population: 347275807, yearlyChange: 0.54, density: 38, landArea: 9147420, migrants: 1230663, fertilityRate: 1.62, medianAge: 38.5, urbanPopulationPercent: 82.8 },
  { name: 'Indonesia', code: 'ID', population: 285721236, yearlyChange: 0.79, density: 158, landArea: 1811570, migrants: -39509, fertilityRate: 2.1, medianAge: 30.4, urbanPopulationPercent: 59.6 },
  { name: 'Pakistan', code: 'PK', population: 255219554, yearlyChange: 1.57, density: 331, landArea: 770880, migrants: -1235336, fertilityRate: 3.5, medianAge: 20.6, urbanPopulationPercent: 34.4 },
  { name: 'Nigeria', code: 'NG', population: 237527782, yearlyChange: 2.08, density: 261, landArea: 910770, migrants: -15258, fertilityRate: 4.3, medianAge: 18.1, urbanPopulationPercent: 54.9 },
  { name: 'Brazil', code: 'BR', population: 212812405, yearlyChange: 0.38, density: 25, landArea: 8358140, migrants: -217283, fertilityRate: 1.6, medianAge: 34.8, urbanPopulationPercent: 91.4 },
  { name: 'Bangladesh', code: 'BD', population: 175686899, yearlyChange: 1.22, density: 1350, landArea: 130170, migrants: -402100, fertilityRate: 2.11, medianAge: 26, urbanPopulationPercent: 42.6 },
  { name: 'Russia', code: 'RU', population: 143997393, yearlyChange: -0.57, density: 9, landArea: 16376870, migrants: -251822, fertilityRate: 1.47, medianAge: 40.3, urbanPopulationPercent: 75 },
  { name: 'Ethiopia', code: 'ET', population: 135472051, yearlyChange: 2.58, density: 135, landArea: 1000000, migrants: 24054, fertilityRate: 3.81, medianAge: 19.1, urbanPopulationPercent: 22.5 },
  { name: 'Mexico', code: 'MX', population: 131946900, yearlyChange: 0.83, density: 68, landArea: 1943950, migrants: -108037, fertilityRate: 1.87, medianAge: 29.6, urbanPopulationPercent: 87.9 },
  { name: 'Japan', code: 'JP', population: 123103479, yearlyChange: -0.52, density: 338, landArea: 364555, migrants: 140579, fertilityRate: 1.23, medianAge: 49.8, urbanPopulationPercent: 93.1 },
  { name: 'Egypt', code: 'EG', population: 118365995, yearlyChange: 1.57, density: 119, landArea: 995450, migrants: -57305, fertilityRate: 2.71, medianAge: 24.5, urbanPopulationPercent: 40.9 },
  { name: 'Philippines', code: 'PH', population: 116786962, yearlyChange: 0.81, density: 392, landArea: 298170, migrants: -149315, fertilityRate: 1.88, medianAge: 26.1, urbanPopulationPercent: 49.3 },
  { name: 'DR Congo', code: 'CD', population: 112832473, yearlyChange: 3.25, density: 50, landArea: 2267050, migrants: -27309, fertilityRate: 5.9, medianAge: 15.8, urbanPopulationPercent: 45 },
  { name: 'Vietnam', code: 'VN', population: 101598527, yearlyChange: 0.6, density: 328, landArea: 310070, migrants: -48171, fertilityRate: 1.88, medianAge: 33.4, urbanPopulationPercent: 41.4 },
  { name: 'Iran', code: 'IR', population: 92417681, yearlyChange: 0.93, density: 57, landArea: 1628550, migrants: 116786, fertilityRate: 1.67, medianAge: 34, urbanPopulationPercent: 73.3 },
  { name: 'Turkey', code: 'TR', population: 87685426, yearlyChange: 0.24, density: 114, landArea: 769630, migrants: -258205, fertilityRate: 1.62, medianAge: 33.5, urbanPopulationPercent: 76.9 },
  { name: 'Germany', code: 'DE', population: 84075075, yearlyChange: -0.56, density: 241, landArea: 348560, migrants: -334072, fertilityRate: 1.46, medianAge: 45.5, urbanPopulationPercent: 76.5 },
  { name: 'Thailand', code: 'TH', population: 71809359, yearlyChange: 0.13, density: 140, landArea: 510890, migrants: 66752, fertilityRate: 1.27, medianAge: 40.4, urbanPopulationPercent: 53.1 },
  { name: 'United Kingdom', code: 'GB', population: 68886291, yearlyChange: 0.22, density: 284, landArea: 241930, migrants: 129624, fertilityRate: 1.52, medianAge: 42.5, urbanPopulationPercent: 83.1 },
  { name: 'France', code: 'FR', population: 66583625, yearlyChange: 0.15, density: 123, landArea: 547557, migrants: 8807, fertilityRate: 1.8, medianAge: 43.2, urbanPopulationPercent: 83.4 },
  { name: 'South Africa', code: 'ZA', population: 63043979, yearlyChange: 1.2, density: 52, landArea: 1213090, migrants: 157892, fertilityRate: 2.24, medianAge: 27, urbanPopulationPercent: 68.3 },
  { name: 'Italy', code: 'IT', population: 59037474, yearlyChange: -0.54, density: 200, landArea: 294140, migrants: -79493, fertilityRate: 1.25, medianAge: 48.5, urbanPopulationPercent: 70 },
  { name: 'South Korea', code: 'KR', population: 51784059, yearlyChange: -0.2, density: 527, landArea: 97230, migrants: 10000, fertilityRate: 0.75, medianAge: 45.8, urbanPopulationPercent: 81.7 },
  { name: 'Spain', code: 'ES', population: 48345223, yearlyChange: 0.39, density: 96, landArea: 498800, migrants: 200000, fertilityRate: 1.22, medianAge: 46.6, urbanPopulationPercent: 80.1 },
  { name: 'Colombia', code: 'CO', population: 48030719, yearlyChange: -0.21, density: 46, landArea: 1109500, migrants: -205000, fertilityRate: 1.52, medianAge: 34.1, urbanPopulationPercent: 82.8 },
  { name: 'Canada', code: 'CA', population: 40097761, yearlyChange: 0.78, density: 4, landArea: 9093510, migrants: 242032, fertilityRate: 1.38, medianAge: 42.1, urbanPopulationPercent: 81.9 },
  { name: 'Australia', code: 'AU', population: 27779461, yearlyChange: 1.13, density: 4, landArea: 7682300, migrants: 167351, fertilityRate: 1.55, medianAge: 36.6, urbanPopulationPercent: 86 }
];

export const metrics: GameMetric[] = [
  {
    id: 'population',
    name: 'Population',
    description: 'Total number of people living in the country',
    valueFormatter: (value) => value.toLocaleString(),
    higherIsBetter: true,
    accessor: (country) => country.population
  },
  {
    id: 'landArea',
    name: 'Land Area',
    description: 'Total land area in square kilometers',
    valueFormatter: (value) => `${value.toLocaleString()} km²`,
    higherIsBetter: true,
    accessor: (country) => country.landArea
  },
  {
    id: 'density',
    name: 'Population Density',
    description: 'Number of people per square kilometer',
    valueFormatter: (value) => `${value.toLocaleString()} people/km²`,
    higherIsBetter: true, 
    accessor: (country) => country.density
  },
  {
    id: 'medianAge',
    name: 'Median Age',
    description: 'The median age of the population',
    valueFormatter: (value) => value.toFixed(1),
    higherIsBetter: true,
    accessor: (country) => country.medianAge
  },
  {
    id: 'urbanPopulationPercent',
    name: 'Urban Population',
    description: 'Percentage of population living in urban areas',
    valueFormatter: (value) => `${value.toFixed(1)}%`,
    higherIsBetter: true,
    accessor: (country) => country.urbanPopulationPercent
  },
  {
    id: 'migrants',
    name: 'Net Migration',
    description: 'Net number of migrants (negative means emigration)',
    valueFormatter: (value) => value.toLocaleString(),
    higherIsBetter: true,
    accessor: (country) => country.migrants
  },
  {
    id: 'fertilityRate',
    name: 'Fertility Rate',
    description: 'Average number of children per woman',
    valueFormatter: (value) => value.toFixed(2),
    higherIsBetter: true,
    accessor: (country) => country.fertilityRate
  },
  {
    id: 'yearlyChange',
    name: 'Yearly Change',
    description: 'Annual population growth rate (percentage)',
    valueFormatter: (value) => `${value.toFixed(2)}%`,
    higherIsBetter: true,
    accessor: (country) => country.yearlyChange
  }
]; 