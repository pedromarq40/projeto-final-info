SELECT a.CPF,
       a.nome_completo,
       m.data_geracao,
       m.id_plano,
       m.valor,
       m.vencimento,
       m.data_pagamento,
       p.nome AS plano,
       CASE
           WHEN m.data_pagamento IS NOT NULL THEN 'paga'
           WHEN m.vencimento < CURDATE() THEN 'atrasada'
           ELSE 'pendente'
       END AS status
FROM aluno a
LEFT JOIN mensalidade m ON m.CPF = a.CPF
LEFT JOIN plano p ON p.id_plano = m.id_plano
ORDER BY a.nome_completo, m.vencimento DESC
