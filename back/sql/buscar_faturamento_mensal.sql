SELECT DATE_FORMAT(data_pagamento, '%Y-%m') AS mes,
    COUNT(*) AS pagamentos,
    SUM(valor) AS valor
FROM mensalidade
WHERE data_pagamento >= DATE_FORMAT(
    DATE_SUB(CURDATE(), INTERVAL 11 MONTH),
    '%Y-%m-01'
)
GROUP BY DATE_FORMAT(data_pagamento, '%Y-%m')
ORDER BY mes DESC