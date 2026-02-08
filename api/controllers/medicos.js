import { db } from '../db.js'

export const getMedicos = (req, res) => {
    const { nome, crm, page = 1, limit = 10 } = req.query

    const safeLimit = Math.min(Number(limit) || 10, 100)
    const safePage = Math.max(Number(page) || 1, 1)
    const offset = (safePage - 1) * safeLimit

    let dataQuery = `
        SELECT SQL_CALC_FOUND_ROWS *
        FROM medicos
        WHERE 1=1
    `

    const dataParams = []

    if (nome) {
        dataQuery += ' AND nome LIKE ?'
        dataParams.push(`%${nome}%`)
    }

    if (crm) {
        dataQuery += ' AND crm LIKE ?'
        dataParams.push(`%${crm}%`)
    }

    dataQuery += ' ORDER BY nome ASC LIMIT ? OFFSET ?'
    dataParams.push(safeLimit, offset)

    db.query(dataQuery, dataParams, (err, results) => {
        if (err) {
            return res.status(500).json({
                erro: 'Erro interno no servidor'
            })
        }

        // Busca total de registros para paginação
        db.query('SELECT FOUND_ROWS() AS total', (err2, totalResult) => {
            if (err2) {
                return res.status(500).json({
                    erro: 'Erro ao calcular total de registros'
                })
            }

            const total = totalResult[0].total

            res.status(200).json({
                total,
                data: results
            })
        })
    })
}

export const createMedico = (req, res) => {

    const { nome, crm, estado } = req.body;

    if (!nome || !crm || !estado) {
        return res.status(400).json({
            erro: "NOME, CRM e estado são obrigatórios"
        })
    }

    const values = [nome, crm, estado];

    const query = `
        INSERT INTO medicos (nome, crm, estado)
        VALUES(?, ?, ?)
    `;

    db.query(query, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    erro: "Já existe um medico cadastrado com esse CRM"
                })
            }

            return res.status(500).json({
                erro: "Erro interno no servidor"
            })
        }

        res.status(201).json({
            mensagem: "Médico cadastrado com sucesso",
            medico: {
                id: result.insertId,
                nome,
                crm,
                estado
            }
        })
    })

}

export const updateMedico = (req, res) => {
    const id = req.params.id;
    const { nome, crm, estado } = req.body;

    if (!nome || !crm || !estado) {
        return res.status(400).json({
            erro: "NOME, CRM e estado são obrigatórios"
        })
    }

    const queryUpdate = `
        UPDATE medicos
        SET nome = ?, crm = ?, estado = ?
        WHERE id = ?
    `

    db.query(queryUpdate, [nome, crm, estado, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    erro: "Já existe um médico cadastrado com esse CRM"
                })
            }
            return res.status(500).json({
                erro: "Erro interno no servidor"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                erro: "Médico não encontrado"
            })
        }

        res.status(200).json({
            mensagem: "Médico atualizado com sucesso"
        })
    })
}

export const deleteMedico = (req, res) => {

    const { id } = req.params;

    const queryDelete = `
        DELETE FROM medicos
        WHERE id = ?
    `

    db.query(queryDelete, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                erro: "Erro interno no servidor"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                erro: "Médico não encontrado"
            })
        }

        res.status(200).json({
            mensagem: "Medico deletado com sucesso"
        })
    })

}