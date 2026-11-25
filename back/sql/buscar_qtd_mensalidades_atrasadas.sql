SELECT COALESCE(SUM(valor), 0) AS totalEmAtraso
FROM mensalidade
WHERE data_pagamento IS NULL
AND vencimento < CURDATE()