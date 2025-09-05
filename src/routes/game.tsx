import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import {
  GAME_METRICS_ARRAY,
  GameMetricName,
  SORTED_DATA_DESC,
  METRIC_METADATA,
  CountryDataPoint,
  // getCountryMetaDataForMetric,
  CountryMetaData,
} from "~/data/countries";
import {
  COUNTRY_CODES,
  CountryCode,
  COUNTRY_CODE_TO_NAME,
} from "~/data/country_codes";
import { RAW_DATA } from "~/data/json_data_new";

// Define the Country type based on the new JSON_DATA structure
export type Country = {
  Country: string;
  Population: number;
  YearlyChangePct: number;
  NetChange: number;
  Density: number;
  LandArea: number;
  Migrants_net: number;
  Fertility_rate: number;
  MedianAge: number;
  UrbanPopPct: number | null;
  WorldSharePct: number;
  Code: string;
};

function getRandomCountryCodes(count: number): CountryCode[] {
  const indexArray = Array.from({ length: COUNTRY_CODES.length }, (_, i) => i);
  const shuffledIndexArray = indexArray.sort(() => Math.random() - 0.5);
  const randomCountryCodes = shuffledIndexArray
    .slice(0, count)
    .map((i) => COUNTRY_CODES[i]);

  return randomCountryCodes;
}

function getRandomMetric(): GameMetricName {
  return GAME_METRICS_ARRAY[
    Math.floor(Math.random() * GAME_METRICS_ARRAY.length)
  ];
}

function determineHighestRanker(
  metric: GameMetricName,
  countryCodes: CountryCode[]
): CountryCode {
  const metricDataSortedDesc = SORTED_DATA_DESC[metric];

  const rankMapping: { countryCode: CountryCode; rank: number }[] =
    countryCodes.map((countryCode) => {
      const countryRank = metricDataSortedDesc.findIndex(
        (d) => d.countryCode === countryCode
      );
      return {
        countryCode,
        rank: countryRank,
      };
    });

  const rankMappingSorted = rankMapping.sort((a, b) => a.rank - b.rank);

  return rankMappingSorted[0].countryCode;
}

type GameMode = "random" | "practice";

export const Route = createFileRoute("/game")({
  component: CountryGuessGame,
});

type GameState = {
  countries: CountryCode[];
  isGuessCorrect: boolean | null;
  score: number;
  round: number;
  streak: number;
  highScore: number;
  metric: GameMetricName;
  gameMode: GameMode;
};

const initialGameState: GameState = {
  // countries: ["CU", "DO"],
  countries: getRandomCountryCodes(2),
  isGuessCorrect: null,
  score: 0,
  round: 1,
  streak: 0,
  highScore: 0,
  // metric: "YearlyChangePct",
  metric: GAME_METRICS_ARRAY[0],
  gameMode: "random",
};

function CountryGuessGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [animation, setAnimation] = useState<string>("");

  // Get a new pair of countries
  const getNewCountryPair = () => {
    setAnimation("fade-out");

    setTimeout(() => {
      // generate an array with values 0,1,..length of countrycodes-1
      const indexArray = Array.from(
        { length: COUNTRY_CODES.length },
        (_, i) => i
      );
      const shuffledIndexArray = indexArray.sort(() => Math.random() - 0.5);
      const country1: CountryCode = COUNTRY_CODES[shuffledIndexArray[0]];
      const country2: CountryCode = COUNTRY_CODES[shuffledIndexArray[1]];

      setAnimation("fade-in");

      setGameState((prev) => {
        // In random mode, pick a random metric for each round
        let updatedMetric = prev.metric;
        if (prev.gameMode === "random") {
          updatedMetric = getRandomMetric();
        }
        const newState: GameState = {
          ...prev,
          countries: [country1, country2],
          isGuessCorrect: null,
          round: prev.round + 1,
          metric: updatedMetric,
        };
        return newState;
      });
    }, 300);
  };

  // Handle user guess
  const handleGuess = (guessedCountry: CountryCode) => {
    const correctChoice = determineHighestRanker(
      gameState.metric,
      gameState.countries
    );

    const isGuessCorrect = guessedCountry === correctChoice;

    setGameState((prev) => {
      const newGameState: GameState = {
        ...prev,
        isGuessCorrect: isGuessCorrect,
        score: isGuessCorrect ? prev.score + 1 : prev.score,
        streak: isGuessCorrect ? prev.streak + 1 : 0,
        highScore: Math.max(prev.highScore, prev.score + 1),
      };
      return newGameState;
    });
  };

  // Handle metric change
  const handleSelectMetric = (metric: GameMetricName) => {
    setGameState({
      ...initialGameState,
      metric: metric,
      gameMode: "practice",
    });
  };

  // Play again
  const handlePlayAgain = () => {
    // If game is over, reset everything; otherwise, just get a new pair
    if (gameState.round > 10) {
      setGameState((prev) => ({
        ...initialGameState,
        highScore: prev.highScore, // preserve high score
        metric: prev.gameMode === "random" ? getRandomMetric() : prev.metric,
        gameMode: prev.gameMode,
      }));
      setAnimation("fade-in");
    } else {
      getNewCountryPair();
    }
  };

  // Toggle game mode
  const toggleGameMode = () => {
    setGameState((prev) => {
      const newMode: GameMode =
        prev.gameMode === "random" ? "practice" : "random";
      return {
        ...initialGameState,
        highScore: prev.highScore,
        metric:
          newMode === "random" ? getRandomMetric() : GAME_METRICS_ARRAY[0],
        gameMode: newMode,
      };
    });
    setAnimation("fade-in");
  };

  // Game state derived values for the UI
  const isGameOver = gameState.round > 10;
  const userGuessed = gameState.isGuessCorrect !== null;
  const isCorrect = gameState.isGuessCorrect === true;
  const { score, round, streak, highScore, gameMode } = gameState;

  // Use the imported METRIC_METADATA directly
  const currentMetric = gameState.metric;
  const currentMetricData = METRIC_METADATA[currentMetric];

  const formatterFunction = METRIC_METADATA[currentMetric].valueFormatter;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className=" container mx-auto px-4 py-8  ">
        <Header />

        <MetricInfo
          metricName={currentMetricData.name}
          metricDescription={currentMetricData.description}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {isGameOver ? (
              <GameOver score={score} handlePlayAgain={handlePlayAgain} />
            ) : (
              <CountrySelection
                countries={gameState.countries}
                handleGuess={handleGuess}
                userGuessed={userGuessed}
                currentMetric={currentMetric}
                animation={animation}
                formatterFunction={formatterFunction}
              />
            )}

            {userGuessed && !isGameOver && (
              <NextRoundPrompt
                isCorrect={isCorrect}
                handlePlayAgain={handlePlayAgain}
              />
            )}
          </div>
          <div className="">
            <GameModeSelector
              gameMode={gameMode}
              toggleGameMode={toggleGameMode}
            />
            {gameMode === "practice" && (
              <MetricSelector
                currentMetric={currentMetric}
                handleSelectMetric={handleSelectMetric}
                userGuessed={userGuessed}
                isGameOver={isGameOver}
              />
            )}
            <GameStats
              round={round}
              score={score}
              streak={streak}
              highScore={highScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Components

type HeaderProps = {};
function Header({}: HeaderProps) {
  return (
    <h1 className="text-6xl font-bold mb-20 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
      Country Guesser
    </h1>
  );
}

type GameModeSelector = {
  gameMode: GameMode;
  toggleGameMode: () => void;
};
function GameModeSelector({ gameMode, toggleGameMode }: GameModeSelector) {
  return (
    <div className="flex gap-4 mb-4">
      {["Random Mode", "Single Mode"].map((mode, index) => {
        return (
          <button
            onClick={toggleGameMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gameMode === (index === 0 ? "random" : "practice")
                ? "bg-yellow-400  text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {mode}
          </button>
        );
      })}
    </div>
  );
}

type MetricInfoProps = {
  metricName: string;
  metricDescription: string;
};
function MetricInfo({ metricName, metricDescription }: MetricInfoProps) {
  return (
    <div className="mb-8 bg-gray-800 p-4 rounded-lg">
      <h3 className="font-bold text-5xl mb-2">{metricName} (greatest)</h3>
      <p className="text-gray-300">{metricDescription}</p>
    </div>
  );
}

type MetricSelectorProps = {
  currentMetric: GameMetricName;
  handleSelectMetric: (metric: GameMetricName) => void;
  userGuessed: boolean;
  isGameOver: boolean;
};
function MetricSelector({
  currentMetric,
  handleSelectMetric,
  userGuessed,
  isGameOver,
}: MetricSelectorProps) {
  return (
    <div className="mb-8">
      <label htmlFor="metric-select" className="block text-gray-400 mb-2">
        Select metric:
      </label>
      <select
        id="metric-select"
        value={currentMetric}
        onChange={(e) => handleSelectMetric(e.target.value as GameMetricName)}
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full md:w-auto text-white"
        disabled={userGuessed && !isGameOver}
      >
        {GAME_METRICS_ARRAY.map((metric) => (
          <option key={metric} value={metric}>
            {METRIC_METADATA[metric].name}
          </option>
        ))}
      </select>
    </div>
  );
}

type GameOverProps = {
  score: number;
  handlePlayAgain: () => void;
};
function GameOver({ score, handlePlayAgain }: GameOverProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-10 text-center my-10 animate-fade-in">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
        Game Over!
      </h2>
      <p className="text-2xl mb-4">
        Your final score:{" "}
        <span className="font-bold text-yellow-500">{score}/10</span>
      </p>
      <p className="text-xl mb-8 text-gray-400">
        {score <= 3
          ? "Better luck next time!"
          : score <= 6
          ? "Not bad! Can you do better?"
          : score <= 9
          ? "Great job!"
          : "Perfect score! You're amazing!"}
      </p>
      <button
        onClick={handlePlayAgain}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors shadow-lg shadow-blue-700/30"
      >
        Play Again
      </button>
    </div>
  );
}

type CountryCardProps = {
  countryCode: CountryCode;
  countryName: string;
  userGuessed: boolean;
  correctCode: CountryCode;
  onClick: () => void;
  formatterFunction: (value: number) => string;
  currentMetric: GameMetricName;
};
function CountryCard({
  countryCode,
  userGuessed,
  correctCode,
  onClick,
  formatterFunction,
  currentMetric,
}: CountryCardProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "border-2 rounded-xl p-8 text-center cursor-pointer transition-all transform hover:scale-105 shadow-lg",
        userGuessed
          ? countryCode === correctCode
            ? "border-green-500 bg-green-900/20 shadow-green-500/20"
            : "border-red-500 bg-red-900/20 shadow-red-500/20"
          : "border-blue-500 bg-blue-900/20 hover:bg-blue-900/30 shadow-blue-500/20"
      )}
    >
      <div className="flex items-center justify-center  h-48">
        <span className="text-6xl font-bold ">
          {COUNTRY_CODE_TO_NAME[countryCode]}
        </span>
      </div>

      {userGuessed && (
        <div
          className={`text-5xl font-mono ${
            countryCode === correctCode ? "text-green-400" : "text-red-400"
          }`}
        >
          {formatterFunction(RAW_DATA[countryCode][currentMetric]!)}
        </div>
      )}
    </div>
  );
}

type CountrySelectionProps = {
  countries: CountryCode[];
  handleGuess: (countryCode: CountryCode) => void;
  userGuessed: boolean;
  currentMetric: GameMetricName;
  animation: string;
  formatterFunction: (value: number) => string;
};
function CountrySelection({
  countries,
  handleGuess,
  userGuessed,
  currentMetric,
  animation,
  formatterFunction,
}: CountrySelectionProps) {
  const correctCode = determineHighestRanker(currentMetric, countries);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${animation}`}>
      {countries.map((countryCode) => (
        <CountryCard
          key={countryCode}
          countryCode={countryCode}
          countryName={COUNTRY_CODE_TO_NAME[countryCode]}
          userGuessed={userGuessed}
          correctCode={correctCode}
          onClick={() => handleGuess(countryCode)}
          formatterFunction={formatterFunction}
          currentMetric={currentMetric}
        />
      ))}
    </div>
  );
}

type NextRoundPromptProps = {
  isCorrect: boolean;
  handlePlayAgain: () => void;
};
function NextRoundPrompt({ isCorrect, handlePlayAgain }: NextRoundPromptProps) {
  return (
    <div className="mt-10 text-center">
      <div
        className={`text-3xl font-bold mb-6 ${
          isCorrect ? "text-green-500" : "text-red-500"
        }`}
      >
        {isCorrect ? "✓ Correct!" : "✗ Wrong!"}
      </div>

      <button
        onClick={handlePlayAgain}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors shadow-lg shadow-blue-700/30"
      >
        Next Round
      </button>
    </div>
  );
}

type GameStatsProps = {
  round: number;
  score: number;
  streak: number;
  highScore: number;
};
function GameStats({ round, score, streak, highScore }: GameStatsProps) {
  return (
    <div className="lg:w-64">
      <div className="bg-gray-800/50 rounded-lg p-4 sticky top-4 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">
          Game Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Round:</span>
            <span className="text-white font-medium">{round}/10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Score:</span>
            <span className="text-white font-medium">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Streak:</span>
            <span className="text-white font-medium">{streak}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
            <span className="text-gray-400">High Score:</span>
            <span className="text-yellow-400 font-bold">{highScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
