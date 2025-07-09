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
  hasSpunOnce,
  handleSpinClick,
  rouletteState,
  attemptCount,
  rouletteData
}: {
  onSpinComplete: (result: string) => void
  isSpinning: boolean
  mustSpin: boolean
  setMustSpin: (v: boolean) => void
  hasSpunOnce: boolean
  handleSpinClick: () => void
  rouletteState: 'idle' | 'spinning' | 'stopping' | 'completed'
  attemptCount: number
  rouletteData: Array<{option: string, style: any}>
}) => {
  const [prizeNumber, setPrizeNumber] = useState(0)

  // Dados da roleta - CORRIGIDO PARA CONSISTÊNCIA
  const data = [
    { 
      option: '75% off',
      style: { 
        backgroundColor: 'rgb(15, 21, 27)', // Rosa/Pink
        textColor: '#FFFFFF',
        fontSize: 22
      } 
    }, // ÍNDICE 0 - 75% será esse na segunda tentativa
    { 
      option: '50% off',
      style: { 
        backgroundColor: '#FF5722', // Verde água/Turquesa  
        textColor: '#FFFFFF',
        fontSize: 22
      } 
    }, // ÍNDICE 1
    { 
      option: '25% off',
      style: { 
        backgroundColor: 'rgb(15, 21, 27)', // Azul
        textColor: '#FFFFFF',
        fontSize: 22
      } 
    }, // ÍNDICE 2
    { 
      option: '5% off',
      style: { 
        backgroundColor: 'rgb(255, 255, 255)', // Amarelo/Dourado
        textColor: 'rgb(15, 21, 27)',
        fontSize: 22
      } 
    }, // ÍNDICE 3
    { 
      option: '30% off',
      style: { 
        backgroundColor: '#FF5722', // Laranja/Vermelho
        textColor: '#FFFFFF',
        fontSize: 22
      } 
    }, // ÍNDICE 4
    { 
      option: '10% off',
      style: { 
        backgroundColor: 'rgb(15, 21, 27)', // Roxo
        textColor: '#FFFFFF',
        fontSize: 22
      } 
    }, // ÍNDICE 5 // ÍNDICE 6
    { 
      option: 'Try Again',
      style: { 
        backgroundColor: 'rgb(255, 255, 255)', // Marrom
        textColor: 'rgb(15, 21, 27)',
        fontSize: 22
      } 
    } // ÍNDICE 7 - Try Again na primeira tentativa
  ]

  useEffect(() => {
    if (mustSpin) {
      console.log('🎲 Iniciando spin - Tentativa:', attemptCount)
      console.log('🔍 mustSpin =', mustSpin, '| attemptCount =', attemptCount)
      
      // LÓGICA CORRIGIDA: Determinar targetIndex baseado no attemptCount atual
      let targetIndex: number
      
      if (attemptCount === 1) {
        // PRIMEIRA TENTATIVA: "Try Again" (índice 7)
        targetIndex = 7
        console.log('🎯 PRIMEIRA tentativa (attemptCount=1) - deve cair em Try Again (índice 7)')
        console.log('🔍 data[7].option =', data[7]?.option)
      } else if (attemptCount === 2) {
        // SEGUNDA TENTATIVA: "75% off" (índice 0)
        targetIndex = 0
        console.log('🎯 SEGUNDA tentativa (attemptCount=2) - deve cair em 75% off (índice 0)')
        console.log('🔍 data[0].option =', data[0]?.option)
      } else {
        // TERCEIRA TENTATIVA ou mais: resultado aleatório entre descontos (excluindo Try Again)
        const discountIndexes = [0, 1, 2, 3, 4, 5, 6]; // Todos os prêmios exceto Try Again (índice 7)
        targetIndex = discountIndexes[Math.floor(Math.random() * discountIndexes.length)]
        console.log('🎯 TERCEIRA+ tentativa (attemptCount=' + attemptCount + ') - resultado random (índice ' + targetIndex + ')')
        console.log('🔍 data[' + targetIndex + '].option =', data[targetIndex]?.option)
      }
      
      console.log('🎯 Target index FINAL definido:', targetIndex, 'Target option:', data[targetIndex]?.option)
      
      setPrizeNumber(targetIndex)
    }
  }, [mustSpin, attemptCount, data])

  const handleStopSpinning = () => {
    setMustSpin(false)
    
    // Mapear índices para nomes de resultados CORRETAMENTE
    const resultNames = [
      '75% off',        // índice 0 - corresponde ao data[0].option
      '50% off',        // índice 1 - corresponde ao data[1].option  
      '25% off',        // índice 2 - corresponde ao data[2].option
      '5% off',         // índice 3 - corresponde ao data[3].option
      '30% off',        // índice 4 - corresponde ao data[4].option
      '10% off',        // índice 5 - corresponde ao data[5].option
      'Free shipping',  // índice 6 - corresponde ao data[6].option
      'Try Again'       // índice 7 - corresponde ao data[7].option
    ];
    
    // Usar o índice atual para determinar o resultado
    const finalResult = resultNames[prizeNumber] || "Try Again"
    
    console.log('🛑 Roleta parou! Index:', prizeNumber, 'Resultado:', finalResult, 'AttemptCount:', attemptCount)
    console.log('🔍 Mapeamento: data[' + prizeNumber + '].option =', data[prizeNumber]?.option, '-> finalResult =', finalResult)
    
    // Chamar imediatamente sem delay
    onSpinComplete(finalResult)
  }

  // Debug logs - MUITO IMPORTANTE!
  console.log('🎰 ProfessionalRoulette render:', { 
    mustSpin, 
    prizeNumber, 
    hasSpunOnce,
    targetOption: ['75%', '50%', '25%', '5%', '30%', '10%', 'FRETE GRÁTIS', 'Try Again'][prizeNumber] || 'Unknown',
    tentativa: attemptCount,
    deveriaCairEm: attemptCount === 1 ? 'Try Again' : '75%'
  })

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="relative flex items-center justify-center w-full">
        <div className="w-80 h-80 flex items-center justify-center relative">
          {/* Roleta principal */}
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber % data.length}
            data={data}
            onStopSpinning={handleStopSpinning}
            spinDuration={0.8}
            outerBorderColor="#000000"
            outerBorderWidth={8}
            radiusLineColor="#000000" 
            radiusLineWidth={3}
            fontSize={14}
            fontWeight="bold"
            textDistance={60}
            innerRadius={25}
            innerBorderColor="#FFFFFF"
            innerBorderWidth={4}
            perpendicularText={false}
          />
          
          {/* Centro dourado com "GIRE" - BOTÃO CLICÁVEL */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleSpinClick}
              disabled={rouletteState !== 'idle' || attemptCount >= 3}
              className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-lg z-30 shadow-lg border-4 border[] transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ 
                background: rouletteState === 'idle' 
                  ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)'
                  : 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #FFD700 100%)'
              }}
            >
              {rouletteState === 'spinning' ? (
                <div className="text-sm font-bold">
                  <div className="animate-spin text-base">⟳</div>
                </div>
              ) : rouletteState === 'stopping' ? (
                <div className="text-sm font-bold animate-pulse">
                  STOP
                </div>
              ) : attemptCount >= 3 ? (
                <div className="text-xs font-bold text-gray-600">
                  NO MORE<br/>CHANCES
                </div>
              ) : (
                <div className="text-base font-black">
                  SPIN
                </div>
              )}
            </button>
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
  const [attemptCount, setAttemptCount] = useState(0) // Novo state para controlar tentativas

  console.log('📊 ESTADO ATUAL: hasSpunOnce =', hasSpunOnce, '| currentPage =', currentPage, '| attemptCount =', attemptCount)
  console.log('🎯 CHANCES RESTANTES CALCULADAS:', Math.max(0, 3 - attemptCount), '| Deveria ser 3 no início')
  
  // Estados HTTP para controle da roleta
  const [rouletteState, setRouletteState] = useState<'idle' | 'spinning' | 'stopping' | 'completed'>('idle')
  const [mustSpin, setMustSpin] = useState(false)
  
  // Garantir que attemptCount seja resetado quando chegar na página da roleta
  useEffect(() => {
    if (currentPage === 6 && attemptCount > 0) {
      console.log('🔄 Resetando attemptCount para 0 ao entrar na página da roleta')
      setAttemptCount(0)
      setHasSpunOnce(false)
      setRouletteState('idle')
    }
  }, [currentPage])
  
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
    console.log('📊 Próxima tentativa será:', attemptCount === 1 ? 'PRIMEIRA (Try Again)' : 'SEGUNDA (75% OFF)')
  }, [attemptCount])

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
    if (rouletteState === 'idle' && attemptCount < 3) {
      console.log('🚀 INICIANDO SPIN!')
      console.log('📊 attemptCount ANTES do incremento:', attemptCount)
      
      // Incrementar contador de tentativas
      const novoAttemptCount = attemptCount + 1
      console.log('📊 attemptCount DEPOIS do incremento:', novoAttemptCount)
      console.log('📊 Esta é a tentativa:', novoAttemptCount === 1 ? 'PRIMEIRA' : novoAttemptCount === 2 ? 'SEGUNDA' : 'TERCEIRA+')
      
      // Atualizar o state
      setAttemptCount(novoAttemptCount)
      setIsSpinning(true)
      setRouletteState('spinning')
      
      // Aguardar um pouco para garantir que o state foi atualizado
      setTimeout(() => {
        setMustSpin(true)
      }, 100)
      
      // Tracking da roleta sendo girada
      trackRouletteSpin()
      
      // Tracking específico da tentativa
      if (novoAttemptCount === 1) {
        trackRoletaPrimeiraGirada()
      } else if (novoAttemptCount === 2) {
        trackRoletaSegundaGirada()
      }
      
      // Tocar o áudio correto com tratamento de erro
      try {
        if (novoAttemptCount === 1) {
          console.log('🎵 Tentando tocar áudio 1...')
          if (audio1Ref.current) {
            audio1Ref.current.currentTime = 0
            await audio1Ref.current.play()
            console.log('✅ Áudio 1 tocando!')
          } else {
            console.warn('⚠️ Referência do áudio 1 não encontrada')
          }
        } else {
          console.log('🎵 Tentando tocar áudio 2...')
          if (audio2Ref.current) {
            audio2Ref.current.currentTime = 0
            await audio2Ref.current.play()
            console.log('✅ Áudio 2 tocando!')
          } else {
            console.warn('⚠️ Referência do áudio 2 não encontrada')
          }
        }
      } catch (error) {
        console.error('❌ Erro ao tocar áudio:', error)
        console.log('💡 Dica: O navegador pode estar bloqueando o autoplay de áudio')
      }
    }
  }

  const handleSpinComplete = (result: string) => {
    console.log('🎯 Spin Complete! Result:', result)
    console.log('📊 attemptCount atual:', attemptCount)
    console.log('🔍 Verificando se é Try Again:', result === 'Try Again')
    
    setRouletteState('stopping')
    
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
      console.log('✅ Tracking: Desconto ganho -', result)
    } else {
      trackResultadoTryAgain() // Evento em português para Try Again
      console.log('✅ Tracking: Try Again')
    }
    
    // Mostrar modal imediatamente
    console.log('✅ Abrindo modal com resultado:', result)
    setIsSpinning(false)
    setSpinResult(result)
    setRouletteState('completed')
    setShowModal(true)
    
    // Atualizar hasSpunOnce se necessário
    if (attemptCount === 1) {
      console.log('✅ PRIMEIRA tentativa concluída - setHasSpunOnce(true)')
      setHasSpunOnce(true)
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
            next
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
            next
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

      <header className="text-white text-center relative z-10" style={{ backgroundColor: "#0f151b" }}>
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

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="text-center mb-8">
          <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
              🎯 Spin the Wheel and Win!
            </h2>
            <p className="text-white/90 text-lg mb-4">
              Discover your exclusive Prime Day discount
            </p>
            <div className="flex justify-center space-x-4 text-white/80 mb-4">
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
            {/* Contador de tentativas */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <span className="text-white font-semibold text-sm">
                🎲 Chances remaining: <span className="text-yellow-300 font-bold">{Math.max(0, 3 - attemptCount)}/3</span>
              </span>
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
              handleSpinClick={handleSpinClick}
              rouletteState={rouletteState}
              attemptCount={attemptCount}
              rouletteData={[]}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            {rouletteState === 'idle' && attemptCount < 3 && '⚡ Click GIRE to spin and discover your luck! ⚡'}
            {rouletteState === 'idle' && attemptCount >= 3 && '🚫 No more attempts remaining'}
            {rouletteState === 'spinning' && '🎲 The wheel is spinning...'}
            {rouletteState === 'stopping' && '🛑 The wheel is stopping...'}
            {rouletteState === 'completed' && '✅ Result ready!'}
          </p>
          {attemptCount < 3 && rouletteState === 'idle' && (
            <p className="text-white/50 text-xs mt-2">
              {attemptCount === 0 && 'You have 3 chances to win amazing discounts!'}
              {attemptCount === 1 && 'You have 2 more chances to win!'}
              {attemptCount === 2 && 'This is your final chance - make it count!'}
            </p>
          )}
        </div>
      </div>

      {/* Modal for spin results */}
      <Dialog open={showModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg mx-auto border-0 shadow-2xl animate-in zoom-in-95 duration-300 [&>button]:hidden bg-white">
          <DialogTitle className="sr-only">
            {spinResult === "Try Again" ? "Resultado da Roleta - Tente Novamente" : "Resultado da Roleta - Parabéns!"}
          </DialogTitle>
          {spinResult === "Try Again" ? (
            // MODAL TRY AGAIN - DESIGN PROFISSIONAL
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
              {/* Header com badge de tentativas */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">🎯</span>
                    </div>
                    <h3 className="text-lg font-bold">Prime Day Roulette</h3>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold">Attempt {attemptCount}/3</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Result icon and message */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎲</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Not this time!</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Don't worry! You still have <strong className="text-orange-600">{Math.max(0, 3 - attemptCount)} chance{Math.max(0, 3 - attemptCount) !== 1 ? 's' : ''} remaining</strong> to win your exclusive Prime Day discount.
                  </p>
                </div>

                {/* Progress bar for attempts */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Chances Used</span>
                    <span className="text-xs font-medium text-gray-500">{attemptCount}/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(attemptCount / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Encouragement message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">💡</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-800 text-sm mb-1">Did you know?</h5>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        Our statistics show that {attemptCount === 1 ? '67%' : '89%'} of users win a discount on their {attemptCount === 1 ? 'second' : 'final'} attempt!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <Button 
                  onClick={closeModal} 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎯</span>
                    <span>Try Again ({Math.max(0, 3 - attemptCount)} left)</span>
                  </span>
                </Button>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-500 mt-4">
                  ⏰ Offer expires in 24 hours - Limited time only
                </p>
              </div>
            </div>
          ) : (
            // MODAL VICTORY - DESIGN PROFISSIONAL
            <div className="relative overflow-hidden rounded-2xl bg-white">
              {/* Success header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">🏆</span>
                    </div>
                    <h3 className="text-lg font-bold">Congratulations!</h3>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold">Winner!</span>
                  </div>
                </div>
              </div>

              {/* Prize display */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">You Won!</h4>
                  
                  {/* Prize card */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 mb-4">
                    <p className="text-gray-600 text-sm mb-1">Your exclusive Prime Day discount:</p>
                    <p className="text-3xl font-black text-orange-600">
                      {spinResult === 'Free shipping' ? 'FREE SHIPPING' : 
                       spinResult === '75% off' ? '75% OFF' :
                       spinResult === '50% off' ? '50% OFF' :
                       spinResult === '25% off' ? '25% OFF' :
                       spinResult === '30% off' ? '30% OFF' :
                       spinResult === '10% off' ? '10% OFF' :
                       spinResult === '5% off' ? '5% OFF' :
                       spinResult}
                    </p>
                  </div>
                </div>

                {/* Urgency banner */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-lg">⏰</span>
                    <div>
                      <p className="text-red-800 font-semibold text-sm">Limited Time Offer</p>
                      <p className="text-red-700 text-xs">This discount expires in 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Main CTA button */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleBuyClick(spinResult || undefined)} 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl text-lg"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🛒</span>
                      <span>Claim Discount Now</span>
                      <span>→</span>
                    </span>
                  </Button>
                  
                  {/* Secondary info */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span>🔒</span>
                      <span>Secure checkout</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📦</span>
                      <span>Fast delivery</span>
                    </span>
                  </div>
                </div>

                {/* Social proof */}
                <div className="bg-gray-50 rounded-lg p-3 mt-4">
                  <p className="text-center text-xs text-gray-600">
                    🔥 <strong>2,847</strong> customers claimed their discount today
                  </p>
                </div>
              </div>
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