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

            res.status(200).json({quantidade: data.length});
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}