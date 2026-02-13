import { db } from '../db.js'

export const realizar_pagamento = (req, res) => {
    const { metodo, valor } = req.body;
    const atendimentoId = req.params.id;

    // Validação básica
    if (!metodo || !valor || isNaN(valor) || valor <= 0) {
        return res.status(400).json({
            erro: "Informações incorretas sendo enviadas para o servidor."
        });
    }

    // Buscar total pago até o momento
    const qValorTotal = `
        SELECT 
            a.valor_total,
            COALESCE(SUM(p.valor_pago), 0) AS total_pago
        FROM atendimentos a
        LEFT JOIN pagamentos p ON a.id = p.atendimento_id
        WHERE a.id = ?
        GROUP BY a.valor_total;
    `;

    db.query(qValorTotal, [atendimentoId], (err, result) => {
        if (err) {
            return res.status(500).json({
                erro: "Erro ao verificar o valor total do atendimento."
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                erro: "Atendimento não encontrado."
            });
        }

        const valorTotal = parseFloat(result[0].valor_total);
        const totalPago = parseFloat(result[0].total_pago);

        const novoTotalPago = totalPago + parseFloat(valor);

        // Verificação de estouro
        if (novoTotalPago > valorTotal) {
            return res.status(400).json({
                erro: "Valor inválido."
            });
        }

        // Inserção do pagamento
        const qInsert = `
            INSERT INTO pagamentos (atendimento_id, metodo_pagamento, valor_pago)
            VALUES (?, ?, ?);
        `;

        db.query(qInsert, [atendimentoId, metodo, valor], (error) => {
            if (error) {
                return res.status(500).json({
                    erro: "Erro interno no servidor ao realizar o pagamento."
                });
            }

            return res.status(201).json({
                mensagem: "Pagamento realizado com sucesso!",
                totalPago: novoTotalPago,
                valorTotal
            });
        });
    });
};


// Get
export const info_pagamentos = (req, res) => {
    const id = req.params.id;
    const q = `SELECT id, valor_pago, metodo_pagamento, data_pagamento FROM pagamentos
WHERE atendimento_id = ?;`
    db.query(q, [id], (err, result) => {
        if (err) {
            return res.status(400).json('Erro interno no servidor.')
        }

        const valorPago = `SELECT SUM(valor_pago) AS valor_pago FROM pagamentos
WHERE atendimento_id = ?;`

        db.query(valorPago, [id], (error, valorPago) => {
            if (error) {
                return res.status(400).json('Erro interno no servidor.')
            }

            const atendimento = `
                SELECT 
	pacientes.id AS paciente_id,
    pacientes.nome AS paciente_nome,
    DATE_FORMAT(pacientes.idade, '%d/%m/%Y') AS paciente_idade,
    atendimentos.id AS atendimento_id
    FROM atendimentos
    INNER JOIN pacientes ON atendimentos.paciente_id = pacientes.id
    where atendimentos.id = ?;
            `
            db.query(atendimento, [id], (attErr, resultAtendimento) => {
                if (attErr) {
                    return res.status(400).json('Erro interno no servidor.')
                }
                res.status(200).json({ resultAtendimento, result, valorPago })
            })

        })
    })
}

export const atualizar_pagamento = (req, res) => {
    const { valor_pago, metodo_pagamento } = req.body;
    const pagamentoId = req.params.id;

    if (!valor_pago || isNaN(valor_pago) || valor_pago <= 0 || !metodo_pagamento) {
        return res.status(400).json({
            erro: "Dados inválidos para atualização do pagamento"
        });
    }

    const qPagamento = `
        SELECT atendimento_id, valor_pago
        FROM pagamentos
        WHERE id = ?
    `

    db.query(qPagamento, [pagamentoId], (err, pagamentoResult) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao buscar pagamento." })
        }

        if (pagamentoResult.length === 0) {
            return res.status(404).json({ erro: "Pagamento não encontrado." })
        }

        const atendimentoId = pagamentoResult[0].atendimento_id;
        const valorAntigo = parseFloat(pagamentoResult[0].valor_pago);

        const qValorTotal = `
            SELECT
                a.valor_total,
                COALESCE(SUM(p.valor_pago), 0) AS total_pago
            FROM atendimentos a
            LEFT JOIN pagamentos p ON a.id = p.atendimento_id
            WHERE a.id = ?
            GROUP BY a.valor_total;
        `

        db.query(qValorTotal, [atendimentoId], (error, result) => {
            if (error) {
                return res.status(500).json({
                    erro: "Erro ao verificar o valor total do atendimento."
                });
            }

            const valorTotal = parseFloat(result[0].valor_total);
            const totalPago = parseFloat(result[0].total_pago);

            const novoTotalPago = totalPago - valorAntigo + parseFloat(valor_pago);

            if (novoTotalPago > valorTotal) {
                return res.status(400).json({
                    erro: "Valor inválido."
                });
            }

            const qUpdate = `
                UPDATE pagamentos
                SET valor_pago = ?, metodo_pagamento = ?
                WHERE id = ?;
            `

            db.query(qUpdate, [valor_pago, metodo_pagamento, pagamentoId], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({
                        erro: "Erro ao atualizar pagamento."
                    })
                }

                return res.status(200).json({
                    mensagem: "Pagamento atuaizado com sucesso.",
                    totalPago: novoTotalPago,
                    valorTotal
                })
            })



        })
    })
}

// export const atualizar_pagamento = (req, res) => {

//     const q = `
//         UPDATE pagamentos
//             SET valor_pago = ?,
//             metodo_pagamento = ?
//         WHERE id = ?;
//     `

//     const values = [
//         req.body.valor_pago,
//         req.body.metodo_pagamento,
//         req.params.id
//     ]

//     db.query(q, values, (err) => {
//         if (err) return res.status(500).json('Erro interno no servidor.')

//         // Buscar total pago até o momento
//         const qValorTotal = `
//         SELECT 
//             a.valor_total,
//             COALESCE(SUM(p.valor_pago), 0) AS total_pago
//         FROM atendimentos a
//         LEFT JOIN pagamentos p ON a.id = p.atendimento_id
//         WHERE a.id = ?
//         GROUP BY a.valor_total;
//     `;

//         db.query(qValorTotal, [req.params.id], (error, result) => {
//             if (error) {
//                 return res.status(500).json({
//                     erro: "Erro ao verificar o valor total do atendimento."
//                 });
//             }

//             if (result.length === 0) {
//                 return res.status(404).json({
//                     erro: "Atendimento não encontrado."
//                 });
//             }

//             const valorTotal = parseFloat(result[0].valor_total)
//             const totalPago = parseFloat(result[0].total_pago)

//             const novoTotalPago = totalPago + parseFloat(valor)

//             if (novoTotalPago > valorTotal) {
//                 return res.status(400).json({
//                     erro: "O valor total pago ultrapassa o valor devido."
//                 });
//             }

//             res.status(200).json('Pagamento atualizado com sucesso.')
//         })

//     })
// }

export const delete_pagamento = (req, res) => {

    const id = req.params.id;

    const q = `
        DELETE FROM pagamentos
        WHERE id = ?
    `

    db.query(q, [id], (err) => {
        if (err) return res.status(500).json('Erro interno no servidor.')
        return res.status(200).json('Pagamento deletado com sucesso.')
    })

}