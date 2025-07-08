"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Gift } from "lucide-react"
import Image from "next/image"

// Custom Progress Component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
    <div
      className="bg-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
)

// Custom Roulette Component
const CustomRoulette = ({
  onSpinComplete,
  isSpinning,
  targetResult,
}: {
  onSpinComplete: (result: string) => void
  isSpinning: boolean
  targetResult: string
}) => {
  const [rotation, setRotation] = useState(0)

  const segments = [
    { text: "Try Again", color: "#FF4444" },
    { text: "75%", color: "#FF6B9D" },
    { text: "50%", color: "#4ECDC4" },
    { text: "25%", color: "#45B7D1" },
    { text: "10%", color: "#96CEB4" },
    { text: "5%", color: "#FFEAA7" },
    { text: "95%", color: "#FF7675" },
    { text: "Try Again", color: "#FF4444" },
  ]

  useEffect(() => {
    if (isSpinning) {
      const targetIndex = targetResult === "95%" ? 6 : 0
      const spins = 5 + Math.random() * 3 // 5-8 full rotations
      const finalRotation = rotation + spins * 360 + targetIndex * 45

      setRotation(finalRotation)

      setTimeout(() => {
        onSpinComplete(targetResult)
      }, 3000)
    }
  }, [isSpinning, targetResult, rotation, onSpinComplete])

  return (
    <div className="relative w-80 h-80">
      <div
        className="w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden transition-transform duration-3000 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            className="absolute w-full h-full flex items-center justify-center text-white font-bold text-lg"
            style={{
              backgroundColor: segment.color,
              clipPath: "polygon(50% 50%, 50% 0%, 85.4% 14.6%)",
              transform: `rotate(${index * 45}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <span
              className="absolute"
              style={{
                transform: `rotate(-${index * 45}deg) translateY(-60px)`,
                color: segment.color === "#FFEAA7" ? "black" : "white",
              }}
            >
              {segment.text}
            </span>
          </div>
        ))}
      </div>

      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-gray-800 flex items-center justify-center">
        <span className="text-gray-800 font-bold text-sm">GIRE</span>
      </div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gray-800"></div>
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
    if (!isSpinning) {
      setIsSpinning(true)
    }
  }

  const handleSpinComplete = (result: string) => {
    setIsSpinning(false)
    setSpinResult(result)
    setShowModal(true)

    if (!hasSpunOnce) {
      setHasSpunOnce(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSpinResult(null)
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
            src="/placeholder.svg?height=40&width=120&text=amazon&color=white"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          <p className="text-sm font-medium">prime day award winning quiz</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full">
          <div className="mb-6">
            <Progress value={getProgressPercentage()} />
            <p className="text-center mt-2 text-sm text-gray-600">
              Question {currentPage} of 4 ({Math.round(getProgressPercentage())}%)
            </p>
          </div>

          <div className="mb-6 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <Image
              src={questionIndex === 2 ? "/images/amazon-warehouse.webp" : "/images/amazon-prime-day.jpg"}
              alt={questionIndex === 2 ? "Amazon Warehouse" : "Amazon Prime Day"}
              width={400}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-orange-600 font-semibold text-lg mb-4">Answer and Win!</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{questions[questionIndex].question}</h2>
          </div>

          <RadioGroup
            value={selectedAnswers[questionIndex] || ""}
            onValueChange={(value) => handleAnswerSelect(value, questionIndex)}
            className="space-y-4 mb-8"
          >
            {questions[questionIndex].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={nextPage}
            disabled={!selectedAnswers[questionIndex]}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
          >
            Next
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
            src="/placeholder.svg?height=40&width=120&text=amazon&color=white"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          <p className="text-sm font-medium">prime day award winning quiz</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations on completing the quiz!</h2>
            <p className="text-gray-600 mb-6">
              You've just unlocked a special Prime Day benefit - Amazon's biggest deals event, with limited-time real
              discounts and free shipping for Prime members.
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
            🎡 SPIN THE ROULETTE WHEEL
          </Button>

          <Button
            onClick={nextPage}
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
          >
            Rescue
          </Button>
        </div>
      </div>
    </div>
  )

  const renderRoulettePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 flex flex-col">
      <header className="text-white p-4 text-center" style={{ backgroundColor: "#0f151b" }}>
        <div className="flex flex-col items-center">
          <Image
            src="/placeholder.svg?height=40&width=120&text=amazon&color=white"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          <p className="text-sm font-medium">prime day award winning quiz</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <Image
            src="/placeholder.svg?height=100&width=200&text=amazon"
            alt="Amazon Logo"
            width={200}
            height={100}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Gire a Roleta para ganhar o seu Mega Desconto!</h2>
        </div>

        <div className="relative mb-8">
          <CustomRoulette
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            targetResult={hasSpunOnce ? "95%" : "Try Again"}
          />
        </div>

        <Button
          onClick={handleSpinClick}
          disabled={isSpinning}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-xl font-bold rounded-full disabled:opacity-50"
        >
          {isSpinning ? "GIRANDO..." : "GIRAR AGORA!"}
        </Button>
      </div>

      {/* Modal for spin results */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm mx-auto">
          {spinResult === "Try Again" ? (
            <div className="text-center p-6">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-xl font-bold mb-4">Uma pena!</h3>
              <p className="text-gray-600 mb-6">
                Você foi o grande selecionado e ganhou <strong>01 chance extra</strong> na sorte!
              </p>
              <Button onClick={closeModal} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🤩</div>
              <h3 className="text-xl font-bold mb-4">Parabéns!</h3>
              <p className="text-gray-600 mb-6">
                Você acaba de ganhar o <strong>Mega Desconto de 95%</strong>
              </p>
              <Button onClick={closeModal} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Resgatar seu Prêmio
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
