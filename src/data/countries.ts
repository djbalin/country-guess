// Country data from Worldometers (https://www.worldometers.info/world-population/population-by-country/)
// Data represents 2025 projections according to the United Nations Population Division

import { CountryCode } from "./country_codes";
import { RAW_DATA, RawMetricNames } from "./json_data_new";

export type GameMetricName = RawMetricNames;

export const GAME_METRICS_ARRAY = Object.keys(
  RAW_DATA["IN"]
) as GameMetricName[];

export type CountryDataPoint = {
  countryCode: CountryCode;
  value: number;
};

export const METRIC_METADATA: Record<GameMetricName, MetricMetaData> = {
 Density: {
  name: "Population density",
  description: "Population density measures how many people live in each square kilometer of the country on average.",
  valueFormatter: (value) => `${value.toLocaleString()} people/km²`,
},
LandArea: {
  name: "Land area", 
  description: "The total land area is the size of all land within the country's borders, measured in square kilometers.",
  valueFormatter: (value) => `${value.toLocaleString()} km²`,
},
Population: {
  name: "Population",
  description: "The total number of people living in the country at a given time.",
  valueFormatter: (value) => value.toLocaleString(),
},
YearlyChangePct: {
  name: "Population: Yearly change",
  description: "The percentage by which the country's population grows or shrinks each year.",
  valueFormatter: (value) => `${value.toFixed(2)}%`,
  netValue: true
},
NetChange: {
  name: "Net change in population", 
  description: "The actual number of people by which the population increases or decreases each year.",
  valueFormatter: (value) => value.toLocaleString(),
  netValue: true
},
Migrants_net: {
  name: "Migration (net)",
  description: "Net migration counts whether more people migrate to or emigrate from the country. A negative value means more people move out of the country (emigrate) than move to the country (immigrate).",
  valueFormatter: (value) => value.toLocaleString(),
  netValue: true
},
Fertility_rate: {
  name: "Fertility rate",
  description: "The fertility rate is the average number of children a woman gives birth to during her lifetime.",
  valueFormatter: (value) => value.toFixed(2),
},
MedianAge: {
  name: "Median age",
  description: "The median age is the age at the midpoint of the population. Half of the population is older than the median age and half of the population is younger.",
  valueFormatter: (value) => value.toFixed(1),
},
UrbanPopPct: {
  name: "Urban population",
  description: "The percentage of the country's population that lives in cities and urban areas rather than rural areas.",
  valueFormatter: (value) => `${value.toFixed(1)}%`,
},
WorldSharePct: {
  name: "Population: World share", 
  description: "The percentage of the world's total population that lives in this country.",
  valueFormatter: (value) => `${value.toFixed(1)}%`,
},
};


export const SORTED_DATA_DESC: Record<GameMetricName, CountryDataPoint[]> = {
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

// Sorting

for (const [k, v] of Object.entries(RAW_DATA)) {
  const countryCode = k as CountryCode;
  for (const [k2, metricValue] of Object.entries(v)) {
    const metric = k2 as RawMetricNames;
    if (metricValue === null) continue;
    const output: CountryDataPoint = {
      countryCode,
      value: metricValue,
    };
    SORTED_DATA_DESC[metric].push(output);
  }
}

Object.entries(SORTED_DATA_DESC).map(([k, v]) => {
  const key = k as GameMetricName;
  const sorted = v.sort((a, b) => {
    const { netValue } = METRIC_METADATA[key];
    if (netValue === true) {
      // For metrics 
      a.value = Math.abs(a.value)
      b.value = Math.abs(b.value)
    }
    return b.value - a.value;
  });
  SORTED_DATA_DESC[key] = sorted;
});

type MetricMetaData = {
  name: string;
  description: string;
  valueFormatter: (value: number) => string;
  netValue?: boolean; // Whether higher values are better (true) or worse (false). Default is true.
};

export type CountryMetaData = {
  name: string;
  value: number;
};


