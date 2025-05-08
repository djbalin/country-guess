import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { metrics, type GameMetric, SORTED_DATA } from "~/data/countries";

type GameMode = "random" | "practice";

export const Route = createFileRoute("/game")({
  component: CountryGuessGame,
});

function CountryGuessGame() {
  const [countryPair, setCountryPair] = useState<[Country, Country] | null>(
    null
  );
  const [userGuessed, setUserGuessed] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [animation, setAnimation] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<GameMetric>(metrics[0]);
  const [gameMode, setGameMode] = useState<GameMode>("random");
  const [tableMetric, setTableMetric] =
    useState<keyof typeof SORTED_DATA>("Population");

  // Get a new pair of countries
  const getNewCountryPair = () => {
    setAnimation("fade-out");

    setTimeout(() => {
      const shuffled = [...countries].sort(() => 0.5 - Math.random());
      setCountryPair([shuffled[0], shuffled[1]]);
      setUserGuessed(false);
      setRound((prev) => prev + 1);
      setAnimation("fade-in");

      // In random mode, pick a random metric for each round
      if (gameMode === "random") {
        const randomIndex = Math.floor(Math.random() * metrics.length);
        setSelectedMetric(metrics[randomIndex]);
      }
    }, 300);
  };

  // Initialize the game
  useEffect(() => {
    setAnimation("fade-in");
    const shuffled = [...countries].sort(() => 0.5 - Math.random());
    setCountryPair([shuffled[0], shuffled[1]]);

    // Start with a random metric in random mode
    if (gameMode === "random") {
      const randomIndex = Math.floor(Math.random() * metrics.length);
      setSelectedMetric(metrics[randomIndex]);
    }
  }, [gameMode]);

  // Handle user guess
  const handleGuess = (index: number) => {
    if (userGuessed || !countryPair) return;

    const metric = selectedMetric.accessor;
    const value0 = metric(countryPair[0]);
    const value1 = metric(countryPair[1]);

    const guessedCorrectly =
      (index === 0 && value0 > value1) || (index === 1 && value1 > value0);

    setIsCorrect(guessedCorrectly);
    setUserGuessed(true);

    if (guessedCorrectly) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setHighScore((prev) => Math.max(prev, score + 1));
    } else {
      setStreak(0);
      if (round >= 10) {
        setIsGameOver(true);
      }
    }
  };

  // Play again
  const handlePlayAgain = () => {
    if (isGameOver) {
      // Reset the game
      setScore(0);
      setRound(1);
      setStreak(0);
      setIsGameOver(false);
      const shuffled = [...countries].sort(() => 0.5 - Math.random());
      setCountryPair([shuffled[0], shuffled[1]]);
      setUserGuessed(false);

      // Pick a random metric for random mode
      if (gameMode === "random") {
        const randomIndex = Math.floor(Math.random() * metrics.length);
        setSelectedMetric(metrics[randomIndex]);
      }
    } else {
      getNewCountryPair();
    }
  };

  // Handle metric change
  const handleMetricChange = (metricId: string) => {
    const newMetric = metrics.find((m) => m.id === metricId) || metrics[0];
    setSelectedMetric(newMetric);

    // Reset the game with the new metric
    setScore(0);
    setRound(1);
    setStreak(0);
    setIsGameOver(false);
    setUserGuessed(false);

    setAnimation("fade-out");
    setTimeout(() => {
      const shuffled = [...countries].sort(() => 0.5 - Math.random());
      setCountryPair([shuffled[0], shuffled[1]]);
      setAnimation("fade-in");
    }, 300);
  };

  // Toggle game mode
  const toggleGameMode = () => {
    const newMode = gameMode === "random" ? "practice" : "random";
    setGameMode(newMode);

    // Reset the game
    setScore(0);
    setRound(1);
    setStreak(0);
    setIsGameOver(false);
    setUserGuessed(false);

    if (newMode === "random") {
      const randomIndex = Math.floor(Math.random() * metrics.length);
      setSelectedMetric(metrics[randomIndex]);
    }
  };

  if (!countryPair) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          Country Guesser
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <p className="text-gray-400 mb-4 text-xl">
            Which country has the higher
            {selectedMetric.name.toLowerCase()}?
          </p>

          <div className="flex gap-4 mb-4">
            <button
              onClick={toggleGameMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                gameMode === "random"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Random Mode
            </button>
            <button
              onClick={toggleGameMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                gameMode === "practice"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Practice Mode
            </button>
          </div>
        </div>

        {gameMode === "random" && (
          <div className="mb-8 bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-2">{selectedMetric.name}</h3>
            <p className="text-gray-300">{selectedMetric.description}</p>
          </div>
        )}

        {gameMode === "practice" && (
          <div className="mb-8">
            <label htmlFor="metric-select" className="block text-gray-400 mb-2">
              Select metric:
            </label>
            <select
              id="metric-select"
              value={selectedMetric.id}
              onChange={(e) => handleMetricChange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full md:w-auto text-white"
              disabled={userGuessed && !isGameOver}
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name} - {metric.description}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {isGameOver ? (
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
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${animation}`}
              >
                {countryPair.map((country, index) => (
                  <div
                    key={country.name}
                    onClick={() => handleGuess(index)}
                    className={twMerge(
                      "border-2 rounded-xl p-8 text-center cursor-pointer transition-all transform hover:scale-105 shadow-lg",
                      userGuessed
                        ? selectedMetric.accessor(country) ===
                          Math.max(
                            selectedMetric.accessor(countryPair[0]),
                            selectedMetric.accessor(countryPair[1])
                          )
                          ? "border-green-500 bg-green-900/20 shadow-green-500/20"
                          : "border-red-500 bg-red-900/20 shadow-red-500/20"
                        : "border-blue-500 bg-blue-900/20 hover:bg-blue-900/30 shadow-blue-500/20"
                    )}
                  >
                    <div className="flex items-center justify-center h-32 mb-6 flex-col">
                      <img
                        src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
                        alt={`Flag of ${country.name}`}
                        className="mb-4 rounded shadow-lg w-40 h-auto"
                      />
                      <span className="text-4xl font-bold bg-gradient-to-br from-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {country.name}
                      </span>
                    </div>

                    {userGuessed && (
                      <div
                        className={`text-2xl mt-4 font-mono ${
                          selectedMetric.accessor(country) ===
                          Math.max(
                            selectedMetric.accessor(countryPair[0]),
                            selectedMetric.accessor(countryPair[1])
                          )
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {selectedMetric.name}:{" "}
                        {selectedMetric.valueFormatter(
                          selectedMetric.accessor(country)
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {userGuessed && !isGameOver && (
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
            )}
          </div>

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
        </div>

        {/* Data Table for Visual Check */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Country Data Table</h2>
          <div className="mb-4">
            <label htmlFor="metric-table-select" className="mr-2 text-gray-300">
              Select metric:
            </label>
            <select
              id="metric-table-select"
              value={tableMetric}
              onChange={(e) =>
                setTableMetric(e.target.value as keyof typeof SORTED_DATA)
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              {Object.keys(SORTED_DATA).map((metric) => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700">#</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Country
                  </th>
                  <th className="px-4 py-2 border-b border-gray-700">Code</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    {tableMetric}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SORTED_DATA[tableMetric].map((row, idx) => {
                  // Try to find the code from the countries array
                  const countryObj = countries.find(
                    (c) => c.name === row.country
                  );
                  return (
                    <tr
                      key={row.country}
                      className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                    >
                      <td className="px-4 py-2 border-b border-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-700">
                        {row.country}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-700">
                        {countryObj?.code || "-"}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-700">
                        {row.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
