"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Gift, Zap, Star, Target, Award } from "lucide-react"
import Image from "next/image"
import { Wheel } from 'react-custom-roulette'

// Custom Progress Component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
    <div
      className="bg-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
)

// Professional Roulette Component
const ProfessionalRoulette = ({
  onSpinComplete,
  isSpinning,
  targetResult,
  rouletteState,
  mustSpin,
  setMustSpin
}: {
  onSpinComplete: (result: string) => void
  isSpinning: boolean
  targetResult: string
  rouletteState: 'idle' | 'spinning' | 'stopping' | 'completed'
  mustSpin: boolean
  setMustSpin: (v: boolean) => void
}) => {
  const [prizeNumber, setPrizeNumber] = useState(0)

  const data = [
    { option: '80% OFF', style: { backgroundColor: '#FF9900', textColor: '#232F3E' }, icon: <Star className="w-4 h-4" /> },
    { option: '75% OFF', style: { backgroundColor: '#232F3E', textColor: '#FFFFFF' }, icon: <Zap className="w-4 h-4" /> },
    { option: '50% OFF', style: { backgroundColor: '#FFFFFF', textColor: '#232F3E' }, icon: <Target className="w-4 h-4" /> },
    { option: '25% OFF', style: { backgroundColor: '#FF9900', textColor: '#232F3E' }, icon: <Award className="w-4 h-4" /> },
    { option: '10% OFF', style: { backgroundColor: '#232F3E', textColor: '#FFFFFF' }, icon: <Gift className="w-4 h-4" /> },
    { option: '5% OFF', style: { backgroundColor: '#FFFFFF', textColor: '#232F3E' }, icon: <Star className="w-4 h-4" /> },
    { option: 'Try Again', style: { backgroundColor: '#FF9900', textColor: '#232F3E' }, icon: <Zap className="w-4 h-4" /> },
    { option: 'Free Shipping', style: { backgroundColor: '#232F3E', textColor: '#FFFFFF' }, icon: <Gift className="w-4 h-4" /> },
  ]

  useEffect(() => {
    if (rouletteState === 'spinning') {
      console.log('🎲 Starting spin with target:', targetResult)
      // Find the target result index
      const targetIndex = data.findIndex(item => item.option === targetResult)
      const finalPrizeNumber = targetIndex >= 0 ? targetIndex : 0
      
      console.log('🎯 Target index:', targetIndex, 'Prize number:', finalPrizeNumber)
      setPrizeNumber(finalPrizeNumber)
      setMustSpin(true)

      // Simulate the spin completion - tempo mais longo para dar tempo da roleta girar
      setTimeout(() => {
        console.log('⏰ Spin animation completed, calling onSpinComplete')
        onSpinComplete(targetResult)
      }, 5000) // 5 segundos para a animação completa
    }
  }, [rouletteState, targetResult, onSpinComplete])

  const handleStopSpinning = () => {
    setMustSpin(false)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
          backgroundColors={['#FF9900', '#232F3E', '#FFFFFF', '#FF9900', '#232F3E', '#FFFFFF', '#FF9900', '#232F3E']}
          textColors={['#232F3E', '#FFFFFF', '#232F3E', '#232F3E', '#FFFFFF', '#232F3E', '#232F3E', '#FFFFFF']}
          fontSize={16}
          fontWeight="bold"
          radiusLineWidth={2}
          radiusLineColor="#FF9900"
          outerBorderWidth={4}
          outerBorderColor="#232F3E"
          innerBorderWidth={2}
          innerBorderColor="#FF9900"
          innerRadius={20}
          spinDuration={0.8}
          perpendicularText={true}
        />
        
        {/* Custom Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg"></div>
        </div>
      </div>
    </div>
  )
}

const questions = [
  {
    question: "Do you know what Amazon Prime Day is?",
    options: [
      "Yes, of course! I look forward to it every year",
      "I've heard of it, but I've never used it",
      "No, what's that?",
      "I don't care about these things",
    ],
  },
  {
    question: "Have you ever bought anything on Prime Day?",
    options: [
      "Yes! And it was VERY worthwhile",
      "I bought a little something or other",
      "I just browse the prices...",
      "I've never bought anything on this date",
    ],
  },
  {
    question: "What do you like most about Amazon?",
    options: ["Fast delivery", "Low price", "Reliable reviews", "Variety of products"],
  },
  {
    question: "Which of these areas would most impact your routine with a good Prime Day discount?",
    options: [
      "Kitchen items that make everyday life easier",
      "Accessories for vehicle maintenance",
      "Technical computer equipment",
      "Adventure sports articles",
    ],
  },
]

export default function AmazonPrimeQuiz() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [hasSpunOnce, setHasSpunOnce] = useState(false)
  
  // Estados HTTP para controle da roleta
  const [rouletteState, setRouletteState] = useState<'idle' | 'spinning' | 'stopping' | 'completed'>('idle')
  const [mustSpin, setMustSpin] = useState(false)

  // Referências para os áudios
  const audio1Ref = useRef<HTMLAudioElement | null>(null)
  const audio2Ref = useRef<HTMLAudioElement | null>(null)

  const handleAnswerSelect = (answer: string, questionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = answer
    setSelectedAnswers(newAnswers)
  }

  const nextPage = () => {
    if (currentPage < 6) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleSpinClick = () => {
    if (rouletteState === 'idle') {
      console.log('🚀 Starting roulette spin...')
      setIsSpinning(true)
      setRouletteState('spinning')
      setMustSpin(true)
      // Tocar o áudio correto
      if (!hasSpunOnce) {
        audio1Ref.current?.play()
      } else {
        audio2Ref.current?.play()
      }
    }
  }

  const handleSpinComplete = (result: string) => {
    setMustSpin(false)
    console.log('🎯 Spin Complete! Result:', result)
    setRouletteState('stopping')
    
    // Aguarda a roleta parar completamente antes de mostrar o popup
    setTimeout(() => {
      console.log('✅ Roulette stopped, showing modal...')
      setIsSpinning(false)
      setSpinResult(result)
      setRouletteState('completed')
      setShowModal(true)

      if (!hasSpunOnce) {
        setHasSpunOnce(true)
      }
    }, 1000) // Aguarda 1 segundo após a roleta parar
  }

  const closeModal = () => {
    setShowModal(false)
    setSpinResult(null)
    setRouletteState('idle') // Reset para estado inicial
  }

  const getProgressPercentage = () => {
    const progressValues = [17, 33, 57, 79]
    if (currentPage <= 4) {
      return progressValues[currentPage - 1]
    }
    return 100
  }

  const renderQuestionPage = (questionIndex: number) => (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 flex flex-col">
      <header className="text-white p-4 text-center" style={{ backgroundColor: "#0f151b" }}>
        <div className="flex flex-col items-center">
          <Image
            src="/Captura de Tela 2025-07-08 às 07.34.45.png"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          {/* HEADER - Remover frase do header */}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full">
          {/* ACIMA DA BARRA DE PROGRESSO - Aumentar fonte e centralizar */}
          <p className="text-xl font-bold text-center mb-2">prime day award winning quiz</p>
          <div className="mb-6">
            <Progress value={getProgressPercentage()} />
            <p className="text-center mt-2 text-sm text-gray-600">
              Question {currentPage} of 4 ({Math.round(getProgressPercentage())}%)
            </p>
          </div>
          {/* 'Answer and Win!' - Centralizar */}
          <p className="text-orange-600 font-semibold text-lg mb-4 text-center">Answer and Win!</p>
          <div className="mb-6 flex items-center justify-center">
            <Image
              src={`/images/img ${questionIndex + 1}.png`}
              alt={`Quiz Step ${questionIndex + 1}`}
              width={400}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{questions[questionIndex].question}</h2>

          <RadioGroup
            value={selectedAnswers[questionIndex] || ""}
            onValueChange={(value) => handleAnswerSelect(value, questionIndex)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          >
            {questions[questionIndex].options.map((option, index) => (
              <div key={index} className="flex items-center w-full p-3 border border-gray-200 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition cursor-pointer">
                <RadioGroupItem value={option} id={`option-${index}`} className="mr-3" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-left text-base font-medium">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={nextPage}
            disabled={!selectedAnswers[questionIndex]}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 text-lg font-semibold rounded-xl shadow-md"
          >
            redeem roulette spins
          </Button>
        </div>
      </div>
    </div>
  )

  const renderCongratulationsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 flex flex-col">
      <header className="text-white p-4 text-center" style={{ backgroundColor: "#0f151b" }}>
        <div className="flex flex-col items-center">
          <Image
            src="/Captura de Tela 2025-07-08 às 07.34.45.png"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          {/* HEADER - Remover frase do header */}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full text-center">
          <p className="text-xl font-bold text-center mb-2">prime day award winning quiz</p>
          <div className="mb-6">
            <Progress value={100} />
            <p className="text-center mt-2 text-sm text-gray-600">
              100% of 100%
            </p>
            <p className="text-orange-600 font-semibold text-lg mb-4 text-center">Answer and Win!</p>
          </div>
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations on completing the quiz!</h2>
            <div className="mb-6 flex items-center justify-center">
              <Image
                src="/images/img 5.png"
                alt="Quiz Completed"
                width={400}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-gray-600 mb-6">
              You’ve just unlocked a special Prime Day benefit – Amazon’s biggest deals event, with limited-time real discounts and free shipping for Prime members.
            </p>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex items-center">
              <Gift className="text-yellow-600 mr-2" />
              <div>
                <h3 className="font-bold text-yellow-800">Secret Roulette Unlocked!</h3>
                <p className="text-yellow-700">Spin now and discover your surprise discount of up to 80% OFF.</p>
                <p className="text-sm text-yellow-600 mt-1">Promotions valid for a limited time!</p>
              </div>
            </div>
          </div>

          <Button
            onClick={nextPage}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 text-lg font-semibold mb-4"
          >
            redeem roulette spins
          </Button>
        </div>
      </div>
    </div>
  )

  const renderRoulettePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full opacity-10 animate-ping"></div>
      </div>

      <header className="text-white p-4 text-center relative z-10" style={{ backgroundColor: "#0f151b" }}>
        <div className="flex flex-col items-center">
          <Image
            src="/Captura de Tela 2025-07-08 às 07.34.45.png"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          {/* HEADER - Remover frase do header */}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
              🎯 Spin the Wheel and Win!
            </h2>
            <p className="text-white/90 text-lg mb-4">
              Discover your exclusive Prime Day discount
            </p>
            <div className="flex justify-center space-x-4 text-white/80">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">Up to 80% OFF</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gift className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">Exclusive Offers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
          <ProfessionalRoulette
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            targetResult={hasSpunOnce ? "80% OFF" : "Try Again"}
            rouletteState={rouletteState}
            mustSpin={mustSpin}
            setMustSpin={setMustSpin}
          />
          
          {/* Status Indicator */}
          {rouletteState !== 'idle' && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                {rouletteState === 'spinning' && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="text-white text-sm font-medium">Processing...</span>
                  </>
                )}
                {rouletteState === 'stopping' && (
                  <>
                    <div className="animate-pulse rounded-full h-4 w-4 bg-white"></div>
                    <span className="text-white text-sm font-medium">Finishing...</span>
                  </>
                )}
                {rouletteState === 'completed' && (
                  <>
                    <div className="rounded-full h-4 w-4 bg-green-400"></div>
                    <span className="text-white text-sm font-medium">Completed!</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={handleSpinClick}
            disabled={rouletteState !== 'idle'}
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-12 py-4 text-xl font-bold rounded-full disabled:opacity-50 shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            {rouletteState === 'spinning' ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>SPINNING...</span>
              </div>
            ) : rouletteState === 'stopping' ? (
              <div className="flex items-center space-x-3">
                <div className="animate-pulse rounded-full h-6 w-6 bg-white"></div>
                <span>STOPPING...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6" />
                <span>SPIN NOW!</span>
              </div>
            )}
          </Button>
          
          <p className="text-white/70 text-sm mt-4">
            {rouletteState === 'idle' && '⚡ Click and discover your luck! ⚡'}
            {rouletteState === 'spinning' && '🎲 The wheel is spinning...'}
            {rouletteState === 'stopping' && '🛑 The wheel is stopping...'}
            {rouletteState === 'completed' && '✅ Result ready!'}
          </p>
        </div>
      </div>

      {/* Modal for spin results */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md mx-auto border-0 shadow-2xl animate-in zoom-in-95 duration-300">
          {spinResult === "Try Again" ? (
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <div className="relative mb-6">
                <div className="text-8xl mb-4 animate-bounce">😢</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                  !
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Oops! Try Again</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Don’t give up! You’ve been selected for an <strong className="text-purple-600">extra chance</strong>!
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-purple-700 text-sm">
                  💡 Tip: Many users win on their second try!
                </p>
              </div>
              <Button 
                onClick={closeModal} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                🔄 Try Again
              </Button>
            </div>
          ) : (
            <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
              <div className="relative mb-6">
                <div className="text-8xl mb-4 animate-bounce">🎉</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                  ✓
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Congratulations! 🎊</h3>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl mb-6">
                <p className="text-lg font-bold mb-2">
                  You won: <span className="text-3xl">{spinResult === '80% OFF' ? '80% OFF' : spinResult}</span>
                </p>
                <p className="text-sm opacity-90">
                  Exclusive Prime Day discount!
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Limited Offer!</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Valid for 24 hours only
                </p>
              </div>
              <Button 
                onClick={closeModal} 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                🎁 Redeem Now
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  // Render current page
  if (currentPage <= 4) {
    return renderQuestionPage(currentPage - 1)
  } else if (currentPage === 5) {
    return renderCongratulationsPage()
  } else {
    return renderRoulettePage()
  }
}
