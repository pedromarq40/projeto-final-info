SELECT
    f.id_ficha,
    f.foco,
    f.tipo,
    f.validade,
    e.id_exercicio,
    e.nome AS exercicio,
    e.video,
    ef.carga,
    ef.series,
    ef.repeticoes,
    ef.ordem
FROM FichaDeTreino f
LEFT JOIN ExercicioFicha ef
    ON f.id_ficha = ef.id_ficha
LEFT JOIN exercicio e
    ON ef.id_exercicio = e.id_exercicio
WHERE f.CPF = ?
ORDER BY ef.ordem ASC
