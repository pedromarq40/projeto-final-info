import { useEffect, useState } from "react"
import api from "../api/api.js"
import { agruparRegistrosDeTreino } from "../utils/treinos.js"

export default function useRegistrosDeTreino(habilitado = true) {
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(habilitado)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (!habilitado) return

    api
      .get("/registros-de-treino/meus-registros")
      .then(({ data }) => setRegistros(agruparRegistrosDeTreino(data)))
      .catch((error) => {
        setErro(
          error.response?.data?.error ||
            "Não foi possível carregar os registros de treino.",
        )
      })
      .finally(() => setCarregando(false))
  }, [habilitado])

  return { registros, carregando, erro }
}
