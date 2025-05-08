// Country data from Worldometers (https://www.worldometers.info/world-population/population-by-country/)
// Data represents 2025 projections according to the United Nations Population Division

import { JSON_DATA } from "./json_data_old";

type JSON_KEYS = keyof (typeof JSON_DATA)[number];
type Metric = Exclude<JSON_KEYS, "Country">;
type DataPoint = (typeof JSON_DATA)[number];
type IndexDataPoint = {
  country: string;
  value: number;
};

export type GameMetric = {
  id: string;
  name: string;
  description: string;
  valueFormatter: (value: number) => string;
  accessor: (country: DataPoint) => number;
};

export const SORTED_DATA: Record<Metric, IndexDataPoint[]> = {
  Population: [],
  YearlyChangePct: [],
  NetChange: [],
  Density: [],
  LandArea: [],
  Migrants_net: [],
  Fertility_rate: [],
  MedianAge: [],
  UrbanPopPct: [],
  WorldSharePct: [],
} as const;

type GameData = typeof SORTED_DATA;

export const metrics: GameMetric[] = [
  {
    id: "population",
    name: "Population",
    description: "Total number of people living in the country",
    valueFormatter: (value) => value.toLocaleString(),
    accessor: (country) => country.Population,
  },
  {
    id: "landArea",
    name: "Land Area",
    description: "Total land area in square kilometers",
    valueFormatter: (value) => `${value.toLocaleString()} km²`,
    accessor: (country) => country.LandArea,
  },
  {
    id: "density",
    name: "Population Density",
    description: "Number of people per square kilometer",
    valueFormatter: (value) => `${value.toLocaleString()} people/km²`,
    accessor: (country) => country.Density,
  },
  {
    id: "medianAge",
    name: "Median Age",
    description: "The median age of the population",
    valueFormatter: (value) => value.toFixed(1),
    accessor: (country) => country.MedianAge,
  },
  {
    id: "urbanPopulationPercent",
    name: "Urban Population",
    description: "Percentage of population living in urban areas",
    valueFormatter: (value) => `${value.toFixed(1)}%`,
    accessor: (country) => country.UrbanPopPct,
  },
  {
    id: "migrants",
    name: "Net Migration",
    description: "Net number of migrants (negative means emigration)",
    valueFormatter: (value) => value.toLocaleString(),
    accessor: (country) => country.Migrants_net,
  },
  {
    id: "fertilityRate",
    name: "Fertility Rate",
    description: "Average number of children per woman",
    valueFormatter: (value) => value.toFixed(2),
    accessor: (country) => country.Fertility_rate,
  },
  {
    id: "yearlyChange",
    name: "Yearly Change",
    description: "Annual population growth rate (percentage)",
    valueFormatter: (value) => `${value.toFixed(2)}%`,
    accessor: (country) => country.YearlyChangePct,
  },
];

JSON_DATA.map((dataPoint) => {
  const keys = Object.keys(dataPoint) as JSON_KEYS[];
  keys.map((key) => {
    if (key === "Country") return;
    const val = dataPoint[key];
    if (val === null) return;
    const output: IndexDataPoint = {
      country: dataPoint.Country,
      value: val,
    };
    SORTED_DATA[key].push(output);
  });
});

Object.entries(SORTED_DATA).map(([k, v]) => {
  const key = k as Metric;
  const sorted = v.sort((a, b) => {
    return b.value - a.value;
  });
  SORTED_DATA[key] = sorted;
});
