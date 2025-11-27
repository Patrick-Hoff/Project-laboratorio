import { db } from '../db.js'

// Buscar todos os registros de exames_atendimento
export const getExamesAtendimento = (req, res) => {
    const q = `
   SELECT 
    exames_atendimento.id AS id_primary,
    exames_atendimento.exames_id AS id_exame,
    atendimentos.valor_total AS valor_total,
    exames.cod AS cod_exame,
    exames.nome AS nome_exame,
    exames.valor AS valor
FROM exames_atendimento
INNER JOIN exames ON exames.id = exames_atendimento.exames_id
INNER JOIN atendimentos ON atendimentos.id = exames_atendimento.atendimento_id
WHERE exames_atendimento.atendimento_id = ?;
;
    `

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json({ data })
    })
}

// Criar novo registro de exame em um atendimento
export const addExameAtendimento = (req, res) => {
    const { atendimento_id, resultado } = req.body;
    const exames_id = parseInt(req.body.exames_id);

    const getExameValor = 'SELECT valor FROM exames WHERE id = ?';
    db.query(getExameValor, [exames_id], (err, exameResult) => {
        if (err || exameResult.length === 0) {
            return res.status(404).json({ error: 'Exame não encontrado' });
        }

        const valorExame = parseFloat(exameResult[0].valor) || 0;

        const getAtendimentoValor = 'SELECT valor_total FROM atendimentos WHERE id = ?';
        db.query(getAtendimentoValor, [atendimento_id], (err, atendimentoResult) => {
            if (err || atendimentoResult.length === 0) {
                return res.status(404).json({ error: 'Atendimento não encontrado' });
            }

            const valorAtual = parseFloat(atendimentoResult[0].valor_total) || 0;
            const novoValor = valorAtual + valorExame;

            console.log({
                exame_id: exames_id,
                valor_exame: valorExame,
                valor_atual: valorAtual,
                novo_valor_total: novoValor
            });

            const updateValor = 'UPDATE atendimentos SET valor_total = ? WHERE id = ?';
            db.query(updateValor, [novoValor, atendimento_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao atualizar valor_total' });
                }

                const insertExame =
                    'INSERT INTO exames_atendimento(atendimento_id, exames_id, resultado) VALUES (?, ?, ?)';
                db.query(insertExame, [atendimento_id, exames_id, resultado], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erro ao adicionar exame' });
                    }

                    return res.status(200).json({
                        message: 'Exame vinculado com sucesso',
                        valor_total_atualizado: novoValor.toFixed(2)
                    });
                });
            });
        });
    });
};



// Atualizar resultado de um exame vinculado a um atendimento
export const updateExameAtendimento = (req, res) => {
    const q = 'UPDATE exames_atendimento SET `atendimento_id` = ?, `exames_id` = ?, `resultado` = ? WHERE `id` = ?'

    const values = [
        req.body.atendimento_id,
        req.body.exames_id,
        req.body.resultado,
    ]

    db.query(q, [...values, req.params.id], (err) => {
        if (err) {
            console.log('Erro ao atualizar exame_atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Exame_atendimento atualizado com sucesso')
    })
}

// Deletar registro de exame_atendimento
export const deleteExameAtendimento = (req, res) => {
    const ea_id = req.params.id;         // ID da linha exames_atendimento
    const atendimento_id = req.params.att; // ID do atendimento

    // Buscar exames_id a partir do vínculo
    const getVinculo = `
    SELECT exames_id FROM exames_atendimento 
    WHERE id = ? AND atendimento_id = ?
  `;

    db.query(getVinculo, [ea_id, atendimento_id], (err, vinculoResult) => {
        if (err || vinculoResult.length === 0) {
            return res.status(404).json('Vínculo exame-atendimento não encontrado.');
        }

        const exame_id = vinculoResult[0].exames_id;

        // Buscar valor do exame
        const getExameValor = `SELECT valor FROM exames WHERE id = ?`;
        db.query(getExameValor, [exame_id], (err, exameResult) => {
            if (err || exameResult.length === 0) {
                return res.status(404).json('Exame não encontrado.');
            }

            const valorExame = parseFloat(exameResult[0].valor);

            // Buscar valor total atual do atendimento
            const getAtendimentoValor = `SELECT valor_total FROM atendimentos WHERE id = ?`;
            db.query(getAtendimentoValor, [atendimento_id], (err, atendimentoResult) => {
                if (err || atendimentoResult.length === 0) {
                    return res.status(404).json('Atendimento não encontrado.');
                }

                const valorAtual = parseFloat(atendimentoResult[0].valor_total) || 0;
                const novoValor = Math.max(valorAtual - valorExame, 0);

                // Atualizar o valor_total
                const updateValor = `UPDATE atendimentos SET valor_total = ? WHERE id = ?`;
                db.query(updateValor, [novoValor, atendimento_id], (err) => {
                    if (err) {
                        return res.status(500).json('Erro ao atualizar valor_total.');
                    }

                    // Remover vínculo exame_atendimento
                    const deleteVinculo = `DELETE FROM exames_atendimento WHERE id = ?`;
                    db.query(deleteVinculo, [ea_id], (err) => {
                        if (err) {
                            return res.status(500).json('Erro ao deletar vínculo.');
                        }

                        return res.status(200).json({
                            message: 'Exame removido com sucesso.',
                            novo_valor_total: novoValor.toFixed(2)
                        });
                    });
                });
            });
        });
    });
};
