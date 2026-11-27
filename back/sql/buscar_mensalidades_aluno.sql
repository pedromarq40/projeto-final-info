SELECT DATE_FORMAT(m.data_geracao, '%Y-%m-%d') AS data_geracao,
       m.CPF,
       m.id_plano,
       m.valor,
       m.vencimento,
       m.data_pagamento,
       p.nome AS plano,
      CASE
    WHEN m.data_pagamento IS NOT NULL THEN 'paga'
    WHEN m.status = 'cancelada' THEN 'cancelada'
    WHEN m.vencimento < CURDATE() THEN 'atrasada'
    ELSE 'pendente'
END AS status
FROM mensalidade m
JOIN plano p ON p.id_plano = m.id_plano
WHERE m.CPF = ?
ORDER BY m.vencimento ASC
