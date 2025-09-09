import { db } from '../db.js'

// Buscar todos os atendimentos
export const getAtendimentos = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const searchId = req.query.searchId || '';
    const searchNome = req.query.searchNome || '';

    const countQuery = `
            SELECT COUNT(*) AS total FROM atendimentos
            JOIN pacientes ON atendimentos.paciente_id = pacientes.id
            WHERE atendimentos.id LIKE ? AND pacientes.nome LIKE ?
        `

    const dataQuery = `
    SELECT 
      atendimentos.id AS atendimento_id,
      atendimentos.data_atendimento, 
      pacientes.id AS paciente_id, 
      pacientes.nome, 
      pacientes.idade 
    FROM atendimentos
    JOIN pacientes ON atendimentos.paciente_id = pacientes.id
        WHERE atendimentos.id LIKE ? AND pacientes.nome LIKE ?
        LIMIT ? OFFSET ?;
        `

    const likeId = `%${searchId}%`;
    const likeNome = `%${searchNome}%`;

    db.query(countQuery, [likeId, likeNome], (err, countResult) => {
        if (err) return res.status(500).json(err)

        const total = countResult[0].total;

        db.query(dataQuery, [likeId, likeNome, limit, offset], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json({ data, total })
        })
    })


}


// Criar novo atendimento
export const addAtendimento = (req, res) => {
    const q = 'INSERT INTO atendimentos(`paciente_id`, `data_atendimento`) VALUES (?)'

    if (!req.body.paciente_id || req.body.paciente_id === 0) {
        return res.status(400).json({ error: 'Deve ser adicionado um paciente para criar o atendimento.' })
    }


    const values = [
        req.body.paciente_id,
        req.body.data || new Date()
    ]

    db.query(q, [values], (err, result) => {
        if (err) {
            console.log('Erro ao adicionar atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json({ insertId: result.insertId })
    })
}

// Atualizar atendimento
export const updateAtendimento = (req, res) => {
    const q = 'UPDATE atendimentos SET `paciente_id` = ? WHERE `id` = ?'

    const values = [
        req.body.paciente_id,
    ]

    db.query(q, [...values, req.params.id], (err) => {
        if (err) {
            console.log('Erro ao atualizar atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Atendimento atualizado com sucesso')
    })
}

// Deletar atendimento
export const deleteAtendimento = (req, res) => {
    const q = 'DELETE FROM atendimentos WHERE `id` = ?'

    db.query(q, [req.params.id], (err) => {
        if (err) {
            console.log('Erro ao deletar atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Atendimento deletado com sucesso.')
    })
}


// Retornar os exames de um atendimento específico
export const getExamesPorAtendimento = (req, res) => {
    const q = `
SELECT 
    p.id AS paciente_id,
    p.nome AS nome_paciente,
    p.idade,

    ea.exames_id,
    e.nome AS nome_exame,
    ea.resultado

FROM atendimentos a
INNER JOIN pacientes p ON a.paciente_id = p.id
LEFT JOIN exames_atendimento ea ON ea.atendimento_id = a.id
LEFT JOIN exames e ON ea.exames_id = e.id

WHERE a.id = ?;

    `

    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            console.log('Erro ao buscar exames do atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json(data)
    })
}