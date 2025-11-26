import { db } from '../db.js';

export const consultas_hoje = (req, res) => {
    try {
        const q = `
            SELECT 
                (SELECT COUNT(*) 
                 FROM atendimentos 
                 WHERE data_atendimento >= CURRENT_DATE()
                   AND data_atendimento < CURRENT_DATE() + INTERVAL 1 DAY
                ) AS quantidade_atendimentos,

                (SELECT COALESCE(SUM(valor_total), 0)
                 FROM atendimentos 
                 WHERE data_atendimento >= CURRENT_DATE()
                   AND data_atendimento < CURRENT_DATE() + INTERVAL 1 DAY
                ) AS faturamento,

                (SELECT COUNT(*) 
                 FROM pacientes 
                 WHERE data >= CURRENT_DATE()
                   AND data < CURRENT_DATE() + INTERVAL 1 DAY
                ) AS pacientes_criados;
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