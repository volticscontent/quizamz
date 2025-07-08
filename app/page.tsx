"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Gift, Zap, Star, Target, Award } from "lucide-react"
import Image from "next/image"
import dynamic from 'next/dynamic'
import { useTracking } from "@/hooks/use-tracking"

// Importar o Wheel dinamicamente apenas no cliente
const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  {
    ssr: false,
    loading: () => <div className="w-64 h-64 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Carregando roleta...</div>
    </div>
  }
)

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
  mustSpin,
  setMustSpin,
  hasSpunOnce
}: {
  onSpinComplete: (result: string) => void
  isSpinning: boolean
  mustSpin: boolean
  setMustSpin: (v: boolean) => void
  hasSpunOnce: boolean
}) => {
  const [prizeNumber, setPrizeNumber] = useState(0) // SEMPRE começar no "Try Again"

  // Dados da roleta - ORDEM IMPORTANTE!
  const data = [
    { option: 'Try Again', style: { backgroundColor: '#FF6B6B', textColor: '#FFFFFF' } }, // ÍNDICE 0
    { option: '75% OFF', style: { backgroundColor: '#232F3E', textColor: '#FFFFFF' } },    // ÍNDICE 1
    { option: '50% OFF', style: { backgroundColor: '#FFFFFF', textColor: '#232F3E' } },
    { option: '25% OFF', style: { backgroundColor: '#FF9900', textColor: '#FFFFFF' } },
    { option: '10% OFF', style: { backgroundColor: '#232F3E', textColor: '#FFFFFF' } },
    { option: '5% OFF', style: { backgroundColor: '#FFFFFF', textColor: '#232F3E' } },
    { option: 'Free Shipping', style: { backgroundColor: '#4ECDC4', textColor: '#FFFFFF' } },
    { option: '30% OFF', style: { backgroundColor: '#FF9900', textColor: '#FFFFFF' } },
  ]

  useEffect(() => {
    if (mustSpin) {
      console.log('🎲 Starting spin - Attempt:', hasSpunOnce ? '2nd' : '1st')
      
      // LÓGICA SIMPLES E DIRETA:
      let targetIndex: number
      if (!hasSpunOnce) {
        targetIndex = 0 // PRIMEIRA TENTATIVA: "Try Again" (índice 0)
      } else {
        targetIndex = 1 // SEGUNDA TENTATIVA: "75% OFF" (índice 1)  
      }
      
      console.log('🎯 Target index:', targetIndex, 'Target option:', data[targetIndex]?.option)
      
      setPrizeNumber(targetIndex)
    }
  }, [mustSpin, hasSpunOnce, data])

  const handleStopSpinning = () => {
    setMustSpin(false)
    
    // Usar o índice atual para determinar o resultado
    const finalResult = data[prizeNumber]?.option || (!hasSpunOnce ? "Try Again" : "75% OFF")
    
    console.log('🛑 Roleta parou! Index:', prizeNumber, 'Resultado:', finalResult)
    
    // Chamar imediatamente sem delay
    onSpinComplete(finalResult)
  }

  // Debug logs - MUITO IMPORTANTE!
  console.log('🎰 ProfessionalRoulette render:', { 
    mustSpin, 
    prizeNumber, 
    hasSpunOnce,
    targetOption: data[prizeNumber]?.option,
    tentativa: hasSpunOnce ? 'SEGUNDA' : 'PRIMEIRA',
    deveriaCairEm: hasSpunOnce ? '75% OFF' : 'Try Again'
  })

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="relative flex items-center justify-center w-full">
        <div className="w-96 h-96 flex items-center justify-center">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber % data.length}
            data={data}
            onStopSpinning={handleStopSpinning}
            spinDuration={0.8}
            outerBorderColor="#232F3E"
            outerBorderWidth={5}
            radiusLineColor="#FF9900" 
            radiusLineWidth={2}
            fontSize={14}
            textDistance={65}
          />
        </div>
        
        {/* Custom Amazon-themed Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
          <div className="relative">
            {/* Main Arrow */}
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg"></div>
            {/* Arrow outline */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-b-18 border-l-transparent border-r-transparent border-b-gray-800"></div>
          </div>
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
  console.log('🔥 COMPONENTE AmazonPrimeQuiz RENDERIZANDO/REMONTANDO')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [hasSpunOnce, setHasSpunOnce] = useState(false)

  console.log('📊 ESTADO ATUAL: hasSpunOnce =', hasSpunOnce, '| currentPage =', currentPage)
  
  // Estados HTTP para controle da roleta
  const [rouletteState, setRouletteState] = useState<'idle' | 'spinning' | 'stopping' | 'completed'>('idle')
  const [mustSpin, setMustSpin] = useState(false)
  
  // Estados para debug dos áudios
  const [audio1Loaded, setAudio1Loaded] = useState(false)
  const [audio2Loaded, setAudio2Loaded] = useState(false)
  const [audioDuration] = useState(10.0) // duração fixa: 10 segundos

  // Referências para os áudios
  const audio1Ref = useRef<HTMLAudioElement | null>(null)
  const audio2Ref = useRef<HTMLAudioElement | null>(null)
  
  // Controle de tempo para jornada completa
  const inicioJornadaRef = useRef<number>(Date.now())
  
  // Controle de tempo para retenção de páginas
  const inicioPaginaRef = useRef<number>(Date.now())
  const paginaAnteriorRef = useRef<number>(1)

  // Hook de tracking
  const { 
    trackQuizStart, 
    trackQuizComplete, 
    trackRouletteSpin, 
    trackDiscountWon, 
    trackClickToBuy,
    // Novos eventos em português
    trackPerguntaRespondida,
    trackAvancoPergunta,
    trackQuizCompleto,
    trackEntradaRoleta,
    trackRoletaPrimeiraGirada,
    trackRoletaSegundaGirada,
    trackResultadoTryAgain,
    trackResultadoDesconto,
    trackCliqueFinalizar,
    trackJornadaCompleta,
    // Eventos de retenção e navegação
    trackPaginaVisualizada,
    trackPerguntaVisualizada,
    trackPaginaParabens,
    trackPaginaRoleta,
    trackAbandonoPagina,
    trackProgressoFunil
  } = useTracking()

  // Tracking do início do quiz quando a página carrega
  useEffect(() => {
    trackQuizStart()
  }, [])
  
  // Tracking de mudança de página para metrificar retenção
  useEffect(() => {
    const agora = Date.now()
    const tempoNaPaginaAnterior = (agora - inicioPaginaRef.current) / 1000 // em segundos
    
    // Se não é a primeira página, fazer tracking da página anterior
    if (paginaAnteriorRef.current !== currentPage && paginaAnteriorRef.current <= 6) {
      const tipoPaginaAnterior = paginaAnteriorRef.current <= 4 ? 'pergunta' : 
                                paginaAnteriorRef.current === 5 ? 'parabens' : 'roleta'
      
      trackPaginaVisualizada(paginaAnteriorRef.current, tipoPaginaAnterior, tempoNaPaginaAnterior)
    }
    
    // Tracking da página atual
    if (currentPage <= 4) {
      // Páginas de perguntas (1-4)
      trackPerguntaVisualizada(currentPage)
      trackProgressoFunil(currentPage, 6) // 6 páginas total
    } else if (currentPage === 5) {
      // Página de parabéns
      trackPaginaParabens()
      trackProgressoFunil(currentPage, 6)
    } else if (currentPage === 6) {
      // Página da roleta
      trackPaginaRoleta()
      trackEntradaRoleta() // Evento especial para entrada na roleta
      trackProgressoFunil(currentPage, 6)
    }
    
    // Atualizar referências
    inicioPaginaRef.current = agora
    paginaAnteriorRef.current = currentPage
  }, [currentPage])
  
  // Tracking de abandono da página (quando usuário sai ou fecha navegador)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const tempoNaPagina = (Date.now() - inicioPaginaRef.current) / 1000
      const tipoPagina = currentPage <= 4 ? 'pergunta' : 
                        currentPage === 5 ? 'parabens' : 'roleta'
      
      trackAbandonoPagina(currentPage, tipoPagina, tempoNaPagina)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentPage])

  // Debug: Monitorar mudanças no hasSpunOnce
  useEffect(() => {
    console.log('🔄 hasSpunOnce MUDOU:', hasSpunOnce)
    console.log('📊 Próxima tentativa será:', hasSpunOnce ? 'SEGUNDA (75% OFF)' : 'PRIMEIRA (Try Again)')
  }, [hasSpunOnce])

  // Pré-carregar áudios e detectar duração quando o componente monta
  useEffect(() => {
    const preloadAudios = () => {
      console.log('🎵 Pré-carregando áudios...')
      
      // Pré-carregar áudio 1
      if (audio1Ref.current) {
        const audio1 = audio1Ref.current
        
        const handleAudio1Loaded = () => {
          setAudio1Loaded(true)
          console.log('✅ Áudio 1 carregado (10s)')
        }
        
        audio1.addEventListener('loadedmetadata', handleAudio1Loaded)
        audio1.load()
        console.log('📥 Áudio 1 sendo carregado...')
      }
      
      // Pré-carregar áudio 2
      if (audio2Ref.current) {
        const audio2 = audio2Ref.current
        
        const handleAudio2Loaded = () => {
          setAudio2Loaded(true)
        }
        
        audio2.addEventListener('loadedmetadata', handleAudio2Loaded)
        audio2.load()
        console.log('📥 Áudio 2 sendo carregado...')
      }
    }

    // Executar após um pequeno delay para garantir que os elementos foram montados
    const timer = setTimeout(preloadAudios, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const handleAnswerSelect = (answer: string, questionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = answer
    setSelectedAnswers(newAnswers)
    
    // Tracking da pergunta respondida em português
    trackPerguntaRespondida(
      questionIndex + 1, // Número da pergunta (1-4)
      questions[questionIndex].question, // Texto da pergunta
      answer // Resposta selecionada
    )
  }

  const nextPage = () => {
    if (currentPage < 6) {
      const proximaPagina = currentPage + 1
      
      // Tracking do avanço de pergunta (só para perguntas 1-4)
      if (currentPage <= 4 && proximaPagina <= 4) {
        trackAvancoPergunta(currentPage, proximaPagina)
      }
      
      setCurrentPage(proximaPagina)
      
      // Tracking quando completa o quiz (página 5 = congrats)
      if (currentPage === 4) {
        trackQuizComplete(selectedAnswers)
        trackQuizCompleto(selectedAnswers) // Evento em português
      }
    }
  }

  const handleSpinClick = async () => {
    if (rouletteState === 'idle') {
      console.log('🚀 INICIANDO SPIN!')
      console.log('📊 hasSpunOnce NO INÍCIO DO SPIN:', hasSpunOnce)
      console.log('📊 Esta é a tentativa:', hasSpunOnce ? 'SEGUNDA' : 'PRIMEIRA')
      
      setIsSpinning(true)
      setRouletteState('spinning')
      setMustSpin(true)
      
      // Tracking da roleta sendo girada
      trackRouletteSpin()
      
      // Tracking específico da tentativa (primeira ou segunda)
      if (!hasSpunOnce) {
        trackRoletaPrimeiraGirada()
      } else {
        trackRoletaSegundaGirada()
      }
      
      // Tocar o áudio correto com tratamento de erro
      try {
        if (!hasSpunOnce) {
          console.log('🎵 Tentando tocar áudio 1...')
          if (audio1Ref.current) {
            audio1Ref.current.currentTime = 0 // Reset para o início
            await audio1Ref.current.play()
            console.log('✅ Áudio 1 tocando!')
          } else {
            console.warn('⚠️ Referência do áudio 1 não encontrada')
          }
        } else {
          console.log('🎵 Tentando tocar áudio 2...')
          if (audio2Ref.current) {
            audio2Ref.current.currentTime = 0 // Reset para o início
            await audio2Ref.current.play()
            console.log('✅ Áudio 2 tocando!')
          } else {
            console.warn('⚠️ Referência do áudio 2 não encontrada')
          }
        }
      } catch (error) {
        console.error('❌ Erro ao tocar áudio:', error)
        // Nota: Alguns navegadores bloqueiam autoplay de áudio
        console.log('💡 Dica: O navegador pode estar bloqueando o autoplay de áudio')
      }
    }
  }

  const handleSpinComplete = (result: string) => {
    console.log('🎯 Spin Complete! Result:', result)
    console.log('📊 hasSpunOnce ANTES:', hasSpunOnce)
    console.log('📊 States before update:', { hasSpunOnce, showModal, rouletteState })
    
    setRouletteState('stopping')
    
    // Verificar se o resultado está correto baseado na tentativa
    const expectedResult = !hasSpunOnce ? "Try Again" : "75% OFF"
    if (result !== expectedResult) {
      console.error('❌ RESULTADO ERRADO! Esperado:', expectedResult, 'Recebido:', result)
      console.error('❌ hasSpunOnce atual:', hasSpunOnce)
    } else {
      console.log('✅ Resultado correto:', result)
    }
    
    // Parar os áudios quando a roleta terminar
    try {
      if (audio1Ref.current && !audio1Ref.current.paused) {
        audio1Ref.current.pause()
        console.log('⏸️ Áudio 1 pausado')
      }
      if (audio2Ref.current && !audio2Ref.current.paused) {
        audio2Ref.current.pause()
        console.log('⏸️ Áudio 2 pausado')
      }
    } catch (error) {
      console.error('❌ Erro ao pausar áudios:', error)
    }
    
    // Tracking do desconto ganho
    if (result !== 'Try Again') {
      trackDiscountWon(result)
      trackResultadoDesconto(result) // Evento em português
    } else {
      trackResultadoTryAgain() // Evento em português para Try Again
    }
    
    // Mostrar modal imediatamente
    console.log('✅ Abrindo modal com resultado:', result)
    setIsSpinning(false)
    setSpinResult(result)
    setRouletteState('completed')
    setShowModal(true)
    
    if (!hasSpunOnce) {
      console.log('✅ CHAMANDO setHasSpunOnce(true) - ERA PRIMEIRA TENTATIVA')
      setHasSpunOnce(true)
    } else {
      console.log('📊 hasSpunOnce já era true - ESTA É A SEGUNDA TENTATIVA')
    }
  }

  const closeModal = () => {
    console.log('🔒 FECHANDO MODAL')
    console.log('📊 hasSpunOnce ANTES de fechar modal:', hasSpunOnce)
    setShowModal(false)
    setSpinResult(null)
    setRouletteState('idle') // Reset para estado inicial
    console.log('📊 hasSpunOnce DEPOIS de fechar modal:', hasSpunOnce)
  }

  const handleBuyClick = (discount?: string) => {
    // Tracking do clique para comprar
    trackClickToBuy(discount)
    trackCliqueFinalizar(discount) // Evento em português
    
    // Calcular tempo total da jornada
    const tempoTotalJornada = (Date.now() - inicioJornadaRef.current) / 1000
    trackJornadaCompleta(tempoTotalJornada, discount)
    
    // Link direto para o produto da Amazon
    const amazonUrl = "https://amazom.primekit.shop"
    window.open(amazonUrl, '_blank')
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
            src="/logo.png"
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
            src="/logo.png"
            alt="Amazon Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          {/* HEADER - Remover frase do header */}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg p-8 w-full text-center">
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
            src="/logo.png"
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

                  <div className="p-8 border border-white/20 flex items-center justify-center">
            <style jsx global>{`
              /* Melhorar a aparência da roleta com animação suave */
              .roulette-container {
                filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
                transition: all 0.3s ease;
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
              }
            
            .roulette-container:hover {
              filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4));
              transform: scale(1.02);
            }
            
            /* Suavizar qualquer transição adicional */
            .roulette-container canvas {
              border-radius: 50%;
              transition: transform 0.1s ease-out;
            }
          `}</style>
          <div className={`roulette-container ${mustSpin ? 'roulette-spinning' : ''}`}>
            <ProfessionalRoulette
              onSpinComplete={handleSpinComplete}
              isSpinning={isSpinning}
              mustSpin={mustSpin}
              setMustSpin={setMustSpin}
              hasSpunOnce={hasSpunOnce}
            />
          </div>
          
          
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
          <DialogTitle className="sr-only">
            {spinResult === "Try Again" ? "Resultado da Roleta - Tente Novamente" : "Resultado da Roleta - Parabéns!"}
          </DialogTitle>
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
                onClick={() => handleBuyClick(spinResult || undefined)} 
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
  return (
    <>
      {/* Elementos de áudio - ocultos */}
      <audio 
        ref={audio1Ref} 
        preload="auto"
        onError={(e) => {
          console.error('❌ Erro ao carregar áudio 1:', e)
          setAudio1Loaded(false)
        }}
        onCanPlay={() => {
          console.log('✅ Áudio 1 carregado e pronto')
          setAudio1Loaded(true)
        }}
        onLoadStart={() => console.log('📥 Iniciando carregamento do áudio 1...')}
      >
        <source src="/roleta audio 1.MP3" type="audio/mpeg" />
        Seu navegador não suporta o elemento audio.
      </audio>
      
      <audio 
        ref={audio2Ref} 
        preload="auto"
        onError={(e) => {
          console.error('❌ Erro ao carregar áudio 2:', e)
          setAudio2Loaded(false)
        }}
        onCanPlay={() => {
          console.log('✅ Áudio 2 carregado e pronto')
          setAudio2Loaded(true)
        }}
        onLoadStart={() => console.log('📥 Iniciando carregamento do áudio 2...')}
      >
        <source src="/roleta audio 2.MP3" type="audio/mpeg" />
        Seu navegador não suporta o elemento audio.
      </audio>

      {/* Render da página atual */}
      {currentPage <= 4 && renderQuestionPage(currentPage - 1)}
      {currentPage === 5 && renderCongratulationsPage()}
      {currentPage === 6 && renderRoulettePage()}
    </>
  )
}
