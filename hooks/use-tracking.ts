import { useCallback } from 'react'

declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: any) => void
    pixelId?: string
    utmify?: {
      track: (event: string, data?: any) => void
    }
  }
}

export const useTracking = () => {
  const trackEvent = useCallback((eventName: string, data?: any) => {
    // Facebook Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, data)
    }

    // UTMify tracking (se disponível)
    if (typeof window !== 'undefined' && window.utmify) {
      window.utmify.track(eventName, data)
    }

    // Log para debug
    console.log('📊 Tracking Event:', eventName, data)
  }, [])

  const trackQuizStart = useCallback(() => {
    trackEvent('Lead', {
      content_name: 'Amazon Prime Quiz Started',
      content_category: 'quiz'
    })
  }, [trackEvent])

  const trackQuizComplete = useCallback((answers: string[]) => {
    trackEvent('CompleteRegistration', {
      content_name: 'Amazon Prime Quiz Completed',
      content_category: 'quiz',
      num_items: answers.length
    })
  }, [trackEvent])

  const trackRouletteSpin = useCallback(() => {
    trackEvent('ViewContent', {
      content_name: 'Roulette Spin',
      content_category: 'engagement'
    })
  }, [trackEvent])

  const trackDiscountWon = useCallback((discount: string) => {
    trackEvent('Purchase', {
      content_name: `Discount Won: ${discount}`,
      content_category: 'discount',
      value: parseInt(discount.replace(/\D/g, '')) || 0,
      currency: 'BRL'
    })
  }, [trackEvent])

  const trackClickToBuy = useCallback((discount?: string) => {
    trackEvent('AddToCart', {
      content_name: 'Click to Buy Amazon Product',
      content_category: 'conversion',
      discount_applied: discount || 'none'
    })
  }, [trackEvent])

  // Eventos em português para acompanhar a jornada do usuário
  const trackPerguntaRespondida = useCallback((numeroPergunta: number, pergunta: string, resposta: string) => {
    trackEvent('quiz_pergunta_respondida', {
      content_name: `Pergunta ${numeroPergunta} Respondida`,
      content_category: 'quiz_interacao',
      pergunta_numero: numeroPergunta,
      pergunta_texto: pergunta,
      resposta_selecionada: resposta,
      etapa_funil: 'coleta_dados'
    })
  }, [trackEvent])

  const trackAvancoPergunta = useCallback((dePergunta: number, paraPergunta: number) => {
    trackEvent('quiz_avancar_pergunta', {
      content_name: `Avançou da Pergunta ${dePergunta} para ${paraPergunta}`,
      content_category: 'quiz_navegacao',
      de_pergunta: dePergunta,
      para_pergunta: paraPergunta,
      progresso_percentual: Math.round((paraPergunta / 4) * 100),
      etapa_funil: 'progressao_quiz'
    })
  }, [trackEvent])

  const trackQuizCompleto = useCallback((todasRespostas: string[]) => {
    trackEvent('quiz_finalizado', {
      content_name: 'Quiz Totalmente Finalizado',
      content_category: 'quiz_conclusao',
      total_respostas: todasRespostas.length,
      respostas_completas: todasRespostas,
      etapa_funil: 'quiz_concluido'
    })
  }, [trackEvent])

  const trackEntradaRoleta = useCallback(() => {
    trackEvent('roleta_visualizada', {
      content_name: 'Usuário Chegou na Roleta',
      content_category: 'roleta_acesso',
      etapa_funil: 'pre_conversao',
      momento_jornada: 'pos_quiz'
    })
  }, [trackEvent])

  const trackRoletaPrimeiraGirada = useCallback(() => {
    trackEvent('roleta_primeira_tentativa', {
      content_name: 'Primeira Girada da Roleta',
      content_category: 'roleta_interacao',
      tentativa_numero: 1,
      etapa_funil: 'engajamento_inicial'
    })
  }, [trackEvent])

  const trackRoletaSegundaGirada = useCallback(() => {
    trackEvent('roleta_segunda_tentativa', {
      content_name: 'Segunda Girada da Roleta',
      content_category: 'roleta_interacao',
      tentativa_numero: 2,
      etapa_funil: 'engajamento_conversao'
    })
  }, [trackEvent])

  const trackResultadoTryAgain = useCallback(() => {
    trackEvent('roleta_try_again', {
      content_name: 'Resultado Try Again na Roleta',
      content_category: 'roleta_resultado',
      resultado_tipo: 'try_again',
      etapa_funil: 'primeira_tentativa'
    })
  }, [trackEvent])

  const trackResultadoDesconto = useCallback((desconto: string) => {
    trackEvent('roleta_desconto_ganho', {
      content_name: `Desconto Conquistado: ${desconto}`,
      content_category: 'roleta_resultado',
      desconto_valor: desconto,
      resultado_tipo: 'desconto_ganho',
      etapa_funil: 'conversao_sucesso'
    })
  }, [trackEvent])

  const trackCliqueFinalizar = useCallback((desconto?: string) => {
    trackEvent('jornada_finalizada', {
      content_name: 'Clique Final para Amazon',
      content_category: 'conversao_final',
      desconto_aplicado: desconto || 'nenhum',
      etapa_funil: 'conversao_concluida',
      momento_jornada: 'clique_final'
    })
  }, [trackEvent])

  const trackJornadaCompleta = useCallback((tempoTotal: number, descontoGanho?: string) => {
    trackEvent('jornada_100_completa', {
      content_name: 'Jornada Completa do Quiz à Conversão',
      content_category: 'jornada_sucesso',
      tempo_total_segundos: tempoTotal,
      desconto_final: descontoGanho || 'nenhum',
      etapa_funil: 'jornada_finalizada',
      status_conversao: 'sucesso'
    })
  }, [trackEvent])

  // Eventos de tracking de páginas para metrificar retenção
  const trackPaginaVisualizada = useCallback((numeroPagina: number, tipoPagina: string, tempoNaPagina?: number) => {
    trackEvent('pagina_visualizada', {
      content_name: `Página ${numeroPagina} Visualizada`,
      content_category: 'navegacao_quiz',
      pagina_numero: numeroPagina,
      tipo_pagina: tipoPagina,
      tempo_na_pagina_segundos: tempoNaPagina,
      etapa_funil: `pagina_${numeroPagina}`,
      momento_jornada: 'navegacao'
    })
  }, [trackEvent])

  const trackPerguntaVisualizada = useCallback((numeroPergunta: number) => {
    trackEvent('pergunta_visualizada', {
      content_name: `Pergunta ${numeroPergunta} Visualizada`,
      content_category: 'retencao_quiz',
      pergunta_numero: numeroPergunta,
      progresso_percentual: Math.round((numeroPergunta / 4) * 100),
      etapa_funil: `pergunta_${numeroPergunta}`,
      tipo_interacao: 'visualizacao'
    })
  }, [trackEvent])

  const trackPaginaParabens = useCallback(() => {
    trackEvent('pagina_parabens_visualizada', {
      content_name: 'Página de Parabéns Visualizada',
      content_category: 'retencao_quiz',
      etapa_funil: 'quiz_completo',
      tipo_pagina: 'congratulacoes',
      momento_jornada: 'pos_quiz'
    })
  }, [trackEvent])

  const trackPaginaRoleta = useCallback(() => {
    trackEvent('pagina_roleta_visualizada', {
      content_name: 'Página da Roleta Visualizada',
      content_category: 'retencao_quiz',
      etapa_funil: 'pre_conversao',
      tipo_pagina: 'roleta',
      momento_jornada: 'engajamento'
    })
  }, [trackEvent])

  const trackAbandonoPagina = useCallback((numeroPagina: number, tipoPagina: string, tempoNaPagina: number) => {
    trackEvent('abandono_detectado', {
      content_name: `Abandono na Página ${numeroPagina}`,
      content_category: 'retencao_negativa',
      pagina_numero: numeroPagina,
      tipo_pagina: tipoPagina,
      tempo_antes_abandono: tempoNaPagina,
      etapa_funil: `abandono_pagina_${numeroPagina}`,
      motivo_possivel: 'saida_navegador'
    })
  }, [trackEvent])

  const trackProgressoFunil = useCallback((etapaAtual: number, totalEtapas: number) => {
    const porcentagemProgresso = Math.round((etapaAtual / totalEtapas) * 100)
    trackEvent('progresso_funil', {
      content_name: `Progresso no Funil: ${porcentagemProgresso}%`,
      content_category: 'analise_retencao',
      etapa_atual: etapaAtual,
      total_etapas: totalEtapas,
      porcentagem_progresso: porcentagemProgresso,
      etapa_funil: `progresso_${porcentagemProgresso}_porcento`,
      status_retencao: porcentagemProgresso >= 75 ? 'alta_retencao' : porcentagemProgresso >= 50 ? 'media_retencao' : 'baixa_retencao'
    })
  }, [trackEvent])

      return {
      // Eventos originais
      trackEvent,
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
    }
} 