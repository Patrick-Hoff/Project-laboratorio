import { db } from '../db.js'

export const realizar_pagamento = (req, res) => {
    const { metodo, valor } = req.body;
    const id = req.params.id;

    // Verificação de parâmetros
    if (!metodo || !valor || isNaN(valor) || valor <= 0) {
        return res.status(400).json("Informações incorretas sendo enviadas para o servidor.");
    }

    // Inserção do pagamento
    const q = `
        INSERT INTO pagamentos (atendimento_id, metodo_pagamento, valor_pago) 
        VALUES (?, ?, ?);
    `;
    const values = [
        id,
        metodo,
        valor
    ];

    db.query(q, values, (err, result) => {
        if (err) {
            // Erro na inserção do pagamento
            return res.status(500).json('Erro interno no servidor ao realizar o pagamento.');
        }

        // Verificação do valor total do atendimento
        const valorTotal = `SELECT SUM(valor_total) AS valor_total FROM atendimentos WHERE id = ?`;

        db.query(valorTotal, [id], (error, resultadoAcimaDoTotal) => {
            if (error) {
                // Erro na consulta do valor total do atendimento
                return res.status(500).json('Erro ao verificar o valor total do atendimento.');
            }

            const valorTotalDoAtendimento = parseFloat(resultadoAcimaDoTotal[0]?.valor_total);
            console.log(valorTotalDoAtendimento)
            // Verificação se o valor total é válido
            if (isNaN(valorTotalDoAtendimento) || valorTotalDoAtendimento === null) {
                return res.status(404).json('Atendimento não encontrado ou valor total não disponível.');
            }

            // Verificação se o valor pago ultrapassa o valor total
            if (valor > valorTotalDoAtendimento) {
                return res.status(400).json('O valor pago está acima do valor total da consulta.');
            }

            // Se tudo estiver certo, retornamos o sucesso
            return res.status(200).json({ mensagem: 'Pagamento realizado com sucesso!' });
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

    const q = `
        UPDATE pagamentos
            SET valor_pago = ?,
            metodo_pagamento = ?
        WHERE id = ?;
    `

    const values = [
        req.body.valor_pago,
        req.body.metodo_pagamento,
        req.params.id
    ]

    db.query(q, values, (err) => {
        if (err) return res.status(500).json('Erro interno no servidor.')
        res.status(200).json('Pagamento atualizado com sucesso.')
    })
}

export const delete_pagamento = (req, res) => {

    const id = req.params.id;

    const q = `
        DELETE FROM pagamentos
        WHERE id = ?
    `

    db.query(q, [id], (err) => {
        if(err) return res.status(500).json('Erro interno no servidor.')
        return res.status(200).json('Pagamento deletado com sucesso.')
    })

}