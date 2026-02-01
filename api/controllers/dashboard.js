import { db } from '../db.js';

export const consultas_hoje = (req, res) => {
    try {
        const q = `
          SELECT 
    /* Quantidade de atendimentos no dia */
    (SELECT COUNT(*) 
     FROM atendimentos 
     WHERE data_atendimento >= CURRENT_DATE()
       AND data_atendimento < CURRENT_DATE() + INTERVAL 1 DAY
    ) AS quantidade_atendimentos,

    /* Faturamento do dia com 2 casas decimais */
    (SELECT FORMAT(ROUND(COALESCE(SUM(valor_total), 0), 2), 2)
     FROM atendimentos 
     WHERE data_atendimento >= CURRENT_DATE()
       AND data_atendimento < CURRENT_DATE() + INTERVAL 1 DAY
    ) AS faturamento,

    /* Pacientes criados no dia */
    (SELECT COUNT(*) 
     FROM pacientes 
     WHERE data >= CURRENT_DATE()
       AND data < CURRENT_DATE() + INTERVAL 1 DAY
    ) AS pacientes_criados,
    
    /* Exames realizados no dia */
    (SELECT COUNT(*) 
     FROM exames_atendimento
     WHERE data_realizacao >= CURRENT_DATE()
       AND data_realizacao < CURRENT_DATE() + INTERVAL 1 DAY
    ) AS exames_atendimento;

        `;

        db.query(q, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }

            return res.status(200).json(result[0]);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};