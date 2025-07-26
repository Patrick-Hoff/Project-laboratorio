import { db } from '../db.js'

// Buscar todos os registros de exames_atendimento
export const getExamesAtendimento = (req, res) => {
    const q = `
   

    SELECT 
    exames_atendimento.id AS id_primary,
	exames_atendimento.exames_id AS id_exame,
    exames.cod AS cod_exame,
    exames.nome AS nome_exame
    FROM exames_atendimento
INNER JOIN exames ON exames.id = exames_atendimento.exames_id
    WHERE atendimento_id = ?;
    `

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json({ data })
    })
}

// Criar novo registro de exame em um atendimento
export const addExameAtendimento = (req, res) => {
    const q = 'INSERT INTO exames_atendimento(`atendimento_id`, `exames_id`, `resultado`) VALUES (?)'

    const values = [
        req.body.atendimento_id,
        req.body.exames_id,
        req.body.resultado,
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.log('Erro ao adicionar exame ao atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Exame vinculado ao atendimento com sucesso')
    })
}

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
    const q = 'DELETE FROM exames_atendimento WHERE `id` = ?'

    db.query(q, [req.params.id], (err) => {
        if (err) {
            console.log('Erro ao deletar exame_atendimento: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Exame_atendimento deletado com sucesso.')
    })
}
