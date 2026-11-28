function chaveData(data) {
  if (data instanceof Date) return data.toISOString().slice(0, 10)
  return String(data ?? "").slice(0, 10)
}

export function agruparRegistrosDeTreino(linhas) {
  const registrosPorId = new Map()

  for (const linha of linhas) {
    let registro = registrosPorId.get(linha.id_registro)

    if (!registro) {
      registro = {
        id_registro: linha.id_registro,
        data_registro: linha.data_registro,
        hora: linha.hora,
        duracao: linha.duracao,
        exercicios: [],
      }
      registrosPorId.set(linha.id_registro, registro)
    }

    if (linha.id_exercicio != null && linha.exercicio) {
      registro.exercicios.push({
        id_exercicio: linha.id_exercicio,
        exercicio: linha.exercicio,
        carga: linha.carga_realizada,
        series: linha.series_realizadas,
        repeticoes: linha.repeticoes_realizadas,
        concluido: linha.concluido,
        ordem: linha.ordem,
      })
    }
  }

  return [...registrosPorId.values()]
    .map((registro) => ({
      ...registro,
      exercicios: registro.exercicios.sort(
        (a, b) => Number(a.ordem) - Number(b.ordem),
      ),
    }))
    .sort((a, b) => {
      const primeiro = `${chaveData(a.data_registro)} ${a.hora}`
      const segundo = `${chaveData(b.data_registro)} ${b.hora}`
      return segundo.localeCompare(primeiro)
    })
}

export function duracaoEmSegundos(duracao) {
  if (typeof duracao !== "string") return 0

  const [horas, minutos, segundos] = duracao.split(":").map(Number)
  if (![horas, minutos, segundos].every(Number.isFinite)) return 0

  return horas * 3600 + minutos * 60 + segundos
}

export function formatarDuracao(segundos) {
  if (!Number.isFinite(segundos)) return "—"

  const minutosTotais = Math.round(segundos / 60)
  const horas = Math.floor(minutosTotais / 60)
  const minutos = minutosTotais % 60

  return horas ? `${horas}h ${minutos}min` : `${minutos} min`
}

export function formatarDataTreino(data) {
  const [ano, mes, dia] = chaveData(data).split("-")
  if (!ano || !mes || !dia) return "Data não informada"
  return `${dia}/${mes}/${ano}`
}

export function calcularEstatisticasTreino(registros) {
  const duracoes = registros
    .map((registro) => duracaoEmSegundos(registro.duracao))
    .filter((duracao) => duracao > 0)
  const totalSeries = registros.reduce(
    (total, registro) =>
      total +
      registro.exercicios.reduce(
        (soma, exercicio) =>
          soma +
          (exercicio.concluido ? Number(exercicio.series) || 0 : 0),
        0,
      ),
    0,
  )

  const pontosPorExercicio = new Map()
  const nomesExercicios = new Map()
  const registrosCronologicos = [...registros].sort((a, b) => {
    const primeiro = `${chaveData(a.data_registro)} ${a.hora}`
    const segundo = `${chaveData(b.data_registro)} ${b.hora}`
    return primeiro.localeCompare(segundo)
  })

  for (const registro of registrosCronologicos) {
    for (const exercicio of registro.exercicios) {
      const carga = Number(exercicio.carga)
      if (!Number.isFinite(carga)) continue

      const chave = String(exercicio.id_exercicio ?? exercicio.exercicio)
      nomesExercicios.set(chave, exercicio.exercicio)
      const pontos = pontosPorExercicio.get(chave) || []
      pontos.push({
        data_registro: registro.data_registro,
        id_registro: registro.id_registro,
        carga,
      })
      pontosPorExercicio.set(chave, pontos)
    }
  }

  const evolucao = [...pontosPorExercicio.entries()]
    .map(([chave, pontos]) => {
      const primeiraCarga = pontos[0]?.carga ?? 0
      const ultimaCarga = pontos.at(-1)?.carga ?? 0
      const variacao = ultimaCarga - primeiraCarga

      return {
        id_exercicio: chave,
        exercicio: nomesExercicios.get(chave) || "Exercício",
        pontos,
        primeiraCarga,
        ultimaCarga,
        variacao,
        variacaoPercentual:
          primeiraCarga > 0 ? (variacao / primeiraCarga) * 100 : null,
      }
    })
    .sort((a, b) => {
      const pontos = b.pontos.length - a.pontos.length
      return pontos || a.exercicio.localeCompare(b.exercicio)
    })

  const variacaoDestaque = evolucao
    .filter((item) => item.pontos.length > 1 && item.variacaoPercentual != null)
    .sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao))[0]

  return {
    totalTreinos: registros.length,
    duracaoMediaSegundos: duracoes.length
      ? duracoes.reduce((total, duracao) => total + duracao, 0) /
        duracoes.length
      : null,
    totalSeries,
    evolucao,
    variacaoDestaque,
  }
}
