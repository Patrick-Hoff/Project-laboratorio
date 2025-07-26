import { db } from '../db.js'

// Buscar todos os exames
export const getExames = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const searchId = req.query.searchId || '';
    const searchCod = req.query.searchCod || '';
    const searchNome = req.query.searchNome || '';

    const countQuery = `
        SELECT COUNT(*) AS total FROM exames 
        WHERE id LIKE ? AND cod LIKE ? AND nome LIKE ?`;

    const dataQuery = `
        SELECT * FROM exames 
        WHERE id LIKE ? AND cod LIKE ? AND nome LIKE ?
        LIMIT ? OFFSET ?`;

    const likeId = `%${searchId}%`;
    const likeCod = `%${searchCod}%`;
    const likeNome = `%${searchNome}%`;

    db.query(countQuery, [likeId, likeCod, likeNome], (err, countResult) => {
        if (err) return res.status(500).json(err);

        const total = countResult[0].total;

        db.query(dataQuery, [likeId, likeCod, likeNome, limit, offset], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ data, total });
        });
    });
};



// Criar novo exame
export const addExame = (req, res) => {
    const q = 'INSERT INTO exames(`cod`, `nome`) VALUES (?)'

    const values = [
        req.body.cod,
        req.body.nome,
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.log('Erro ao adicionar novo exame: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Exame criado com sucesso')
    })
}

// Atualizar exame
export const updateExame = (req, res) => {
    const q = 'UPDATE exames SET `cod` = ?, `nome` = ? WHERE `id` = ?'

    const values = [
        req.body.cod,
        req.body.nome,
    ]

    db.query(q, [...values, req.params.id], (err) => {
        if (err) {
            console.log('Erro ao atualizar o exame: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Exame atualizado com sucesso')
    })
}

// Deletar exame
export const deleteExame = (req, res) => {
    const q = 'DELETE FROM exames WHERE `id` = ?'

    db.query(q, [req.params.id], (err) => {
        if (err) {
            console.log('Erro ao deletar exame: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Exame deletado com sucesso.')
    })
}
