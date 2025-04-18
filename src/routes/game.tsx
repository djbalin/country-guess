import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { countries, metrics, type Country, type GameMetric } from '~/data/countries'

export const Route = createFileRoute('/game')({
  component: CountryGuessGame,
})

function CountryGuessGame() {
  const [countryPair, setCountryPair] = useState<[Country, Country] | null>(null)
  const [userGuessed, setUserGuessed] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [round, setRound] = useState<number>(1)
  const [streak, setStreak] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [animation, setAnimation] = useState<string>('')
  const [selectedMetric, setSelectedMetric] = useState<GameMetric>(metrics[0])

  // Get a new pair of countries
  const getNewCountryPair = () => {
    setAnimation('fade-out')
    
    setTimeout(() => {
      const shuffled = [...countries].sort(() => 0.5 - Math.random())
      setCountryPair([shuffled[0], shuffled[1]])
      setUserGuessed(false)
      setRound(prev => prev + 1)
      setAnimation('fade-in')
    }, 300)
  }

  // Initialize the game
  useEffect(() => {
    setAnimation('fade-in')
    const shuffled = [...countries].sort(() => 0.5 - Math.random())
    setCountryPair([shuffled[0], shuffled[1]])
  }, [])

  // Handle user guess
  const handleGuess = (index: number) => {
    if (userGuessed || !countryPair) return

    const metric = selectedMetric.accessor
    const value0 = metric(countryPair[0])
    const value1 = metric(countryPair[1])
    
    let guessedCorrectly: boolean
    
    if (selectedMetric.higherIsBetter) {
      guessedCorrectly = 
        (index === 0 && value0 > value1) ||
        (index === 1 && value1 > value0)
    } else {
      guessedCorrectly = 
        (index === 0 && value0 < value1) ||
        (index === 1 && value1 < value0)
    }

    setIsCorrect(guessedCorrectly)
    setUserGuessed(true)
    
    if (guessedCorrectly) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
      setHighScore(prev => Math.max(prev, score + 1))
    } else {
      setStreak(0)
      if (round >= 10) {
        setIsGameOver(true)
      }
    }
  }

  // Play again
  const handlePlayAgain = () => {
    if (isGameOver) {
      // Reset the game
      setScore(0)
      setRound(1)
      setStreak(0)
      setIsGameOver(false)
      const shuffled = [...countries].sort(() => 0.5 - Math.random())
      setCountryPair([shuffled[0], shuffled[1]])
      setUserGuessed(false)
    } else {
      getNewCountryPair()
    }
  }
  
  // Handle metric change
  const handleMetricChange = (metricId: string) => {
    const newMetric = metrics.find(m => m.id === metricId) || metrics[0]
    setSelectedMetric(newMetric)
    
    // Reset the game with the new metric
    setScore(0)
    setRound(1)
    setStreak(0)
    setIsGameOver(false)
    setUserGuessed(false)
    
    setAnimation('fade-out')
    setTimeout(() => {
      const shuffled = [...countries].sort(() => 0.5 - Math.random())
      setCountryPair([shuffled[0], shuffled[1]])
      setAnimation('fade-in')
    }, 300)
  }

  if (!countryPair) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          Country Guesser
        </h1>
        <p className="text-gray-400 mb-4 text-xl">
          Which country has the {selectedMetric.higherIsBetter ? 'higher' : 'lower'} {selectedMetric.name.toLowerCase()}?
        </p>
        
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
            {metrics.map(metric => (
              <option key={metric.id} value={metric.id}>
                {metric.name} - {metric.description}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Round:</span> 
            <span className="ml-2 text-white font-bold">{round}/10</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Score:</span> 
            <span className="ml-2 text-white font-bold">{score}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Streak:</span> 
            <span className="ml-2 text-white font-bold">{streak}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">High Score:</span> 
            <span className="ml-2 text-white font-bold">{highScore}</span>
          </div>
        </div>
        
        {isGameOver ? (
          <div className="bg-gray-800 rounded-xl p-10 text-center my-10 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Game Over!
            </h2>
            <p className="text-2xl mb-4">Your final score: <span className="font-bold text-yellow-500">{score}/10</span></p>
            <p className="text-xl mb-8 text-gray-400">
              {score <= 3 ? "Better luck next time!" : 
               score <= 6 ? "Not bad! Can you do better?" : 
               score <= 9 ? "Great job!" : "Perfect score! You're amazing!"}
            </p>
            <button
              onClick={handlePlayAgain}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors shadow-lg shadow-blue-700/30"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${animation}`}>
            {countryPair.map((country, index) => (
              <div 
                key={country.name}
                onClick={() => handleGuess(index)}
                className={twMerge(
                  "border-2 rounded-xl p-8 text-center cursor-pointer transition-all transform hover:scale-105 shadow-lg",
                  userGuessed ? (
                    (selectedMetric.higherIsBetter && 
                     selectedMetric.accessor(country) === Math.max(
                       selectedMetric.accessor(countryPair[0]), 
                       selectedMetric.accessor(countryPair[1])
                     )) || 
                    (!selectedMetric.higherIsBetter && 
                     selectedMetric.accessor(country) === Math.min(
                       selectedMetric.accessor(countryPair[0]), 
                       selectedMetric.accessor(countryPair[1])
                     ))
                      ? "border-green-500 bg-green-900/20 shadow-green-500/20"
                      : "border-red-500 bg-red-900/20 shadow-red-500/20"
                  ) : "border-blue-500 bg-blue-900/20 hover:bg-blue-900/30 shadow-blue-500/20"
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
                      (selectedMetric.higherIsBetter && 
                       selectedMetric.accessor(country) === Math.max(
                         selectedMetric.accessor(countryPair[0]), 
                         selectedMetric.accessor(countryPair[1])
                       )) || 
                      (!selectedMetric.higherIsBetter && 
                       selectedMetric.accessor(country) === Math.min(
                         selectedMetric.accessor(countryPair[0]), 
                         selectedMetric.accessor(countryPair[1])
                       ))
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {selectedMetric.name}: {selectedMetric.valueFormatter(selectedMetric.accessor(country))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {(userGuessed && !isGameOver) && (
          <div className="mt-10 text-center">
            <div className={`text-3xl font-bold mb-6 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
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
    </div>
  )
} 