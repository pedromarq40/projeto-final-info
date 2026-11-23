SELECT a.*,
       p.nome,
       p.valor_mensal,
       TIMESTAMPDIFF(MONTH, a.data_assinatura, a.data_vencimento) AS duracao_meses
FROM assinatura a
JOIN plano p ON p.id_plano = a.id_plano
WHERE a.CPF = ?
