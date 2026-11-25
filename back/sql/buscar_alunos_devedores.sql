SELECT a.CPF,
    a.nome_completo,
    COUNT(*) AS mensalidades_atrasadas,
    SUM(m.valor) AS valor_atrasado
FROM aluno a
JOIN mensalidade m ON m.CPF = a.CPF
WHERE m.data_pagamento IS NULL
AND m.vencimento < CURDATE()
GROUP BY a.CPF, a.nome_completo
ORDER BY valor_atrasado DESC, a.nome_completo