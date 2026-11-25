SELECT a.CPF,
       p.nome AS plano
FROM assinatura a
JOIN plano p ON p.id_plano = a.id_plano
WHERE a.data_vencimento >= CURDATE()
