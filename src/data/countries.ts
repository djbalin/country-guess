// Country data from Worldometers (https://www.worldometers.info/world-population/population-by-country/)
// Data represents 2025 projections according to the United Nations Population Division

import { JSON_DATA } from "./json_data_old2";

type JSON_KEYS = keyof (typeof JSON_DATA)[number];
type GameMetric = Exclude<JSON_KEYS, "Country" | "Code">;
type DataPoint = (typeof JSON_DATA)[number];
type IndexDataPoint = {
  country: string;
  value: number;
};

// export type GameMetric = {
//   id: string;
//   name: string;
//   description: string;
//   valueFormatter: (value: number) => string;
//   accessor: (country: DataPoint) => number;
// };

export const SORTED_DATA: Record<GameMetric, IndexDataPoint[]> = {
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

type MetaData = {
  name: string;
  description: string;
  valueFormatter: (value: number) => string;
};
export const METRIC_METADATA: Record<GameMetric, MetaData> = {
  Density: {
    name: "Population density",
    description: "Number of people per square kilometer",
    valueFormatter: (value) => `${value.toLocaleString()} people/km²`,
  },
  LandArea: {
    name: "Land area",
    description: "Total land area in square kilometers",
    valueFormatter: (value) => `${value.toLocaleString()} km²`,
  },
  Population: {
    name: "Population",
    description: "Total number of people living in the country",
    valueFormatter: (value) => value.toLocaleString(),
  },
  YearlyChangePct: {
    name: "Yearly change",
    description: "Annual population growth rate (percentage)",
    valueFormatter: (value) => `${value.toFixed(2)}%`,
  },
  NetChange: {
    name: "Net change",
    description: "Net number of migrants (negative means emigration)",
    valueFormatter: (value) => value.toLocaleString(),
  },
  Migrants_net: {
    name: "Migrants (net)",
    description: "Net number of migrants (negative means emigration)",
    valueFormatter: (value) => value.toLocaleString(),
  },
  Fertility_rate: {
    name: "Fertility rate",
    description: "Average number of children per woman",
    valueFormatter: (value) => value.toFixed(2),
  },
  MedianAge: {
    name: "Median age",
    description: "The median age of the population",
    valueFormatter: (value) => value.toFixed(1),
  },
  UrbanPopPct: {
    name: "Urban population",
    description: "Percentage of population living in urban areas",
    valueFormatter: (value) => `${value.toFixed(1)}%`,
  },
  WorldSharePct: {
    name: "World share",
    description: "Percentage of world population",
    valueFormatter: (value) => `${value.toFixed(1)}%`,
  },
};

JSON_DATA.map((dataPoint) => {
  const keys = Object.keys(dataPoint) as JSON_KEYS[];
  keys.map((key) => {
    if (key === "Country" || key === "Code") return;
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
  const key = k as GameMetric;
  const sorted = v.sort((a, b) => {
    return b.value - a.value;
  });
  SORTED_DATA[key] = sorted;
});
