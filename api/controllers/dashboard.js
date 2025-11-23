import { db } from '../db.js'

export const consultas_hoje = (req, res) => {
    try {
        const q = `
        SELECT *
        FROM atendimentos
        WHERE data_atendimento >= CURRENT_DATE()
          AND data_atendimento < CURRENT_DATE() + INTERVAL 1 DAY;
        `;

        db.query(q, (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }

            // Quantidade de atendimentos
            const quantidade_atendimentos = data.length;

            // Soma dos valores (se houver um campo 'valor_total' em cada atendimento)
            const faturamento = data.reduce((acc, item) => {
                return acc + (item.valor_total || 0);
            }, 0);

            res.status(200).json({
                quantidade_atendimentos: quantidade_atendimentos,
                faturamento
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}
