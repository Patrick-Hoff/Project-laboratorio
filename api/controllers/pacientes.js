import { db } from '../db.js'

// Buscando todos os pacientes
export const getPacientes = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const searchId = req.query.searchId || '';
    const searchNome = req.query.searchNome || '';

    const countQuery = `
        SELECT COUNT(*) AS total FROM pacientes 
        WHERE id LIKE ? AND nome LIKE ?`;

    const dataQuery = `
        SELECT * FROM pacientes
        WHERE id LIKE ? AND nome LIKE ?
        LIMIT ? OFFSET ?`;

    const likeId = `%${searchId}%`;
    const likeNome = `%${searchNome}%`;

    db.query(countQuery, [likeId, likeNome], (err, countResult) => {
        if (err) return res.status(500).json(err);

        const total = countResult[0].total;

        db.query(dataQuery, [likeId, likeNome, limit, offset], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ data, total });
        });
    });
};

// export const getPacientes = (_, res) => {
//     const q = 'SELECT * FROM pacientes'

//     db.query(q, (err, data) => {
//         if (err) return res.status(500).json(err)
//         return res.status(200).json(data)
//     })
// }

// Criar novo paciente no sistema
export const addPacientes = (req, res) => {
    const q = 'INSERT INTO pacientes(`nome`,`idade`) VALUES (?)'

    const values = [
        req.body.nome,
        req.body.idade,
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.log('Erro ao adicionar novo paciente. ' + err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Paciente criado com sucesso')
    })
}


// Atualizar paciente já existente
export const updatePaciente = (req, res) => {
    const q = 'UPDATE pacientes SET `nome` = ?, `idade` = ? WHERE `id` = ?'

    const values = [
        req.body.nome,
        req.body.idade,
    ]

    db.query(q, [...values, req.params.id], (err) => {
        if(err) {
            console.log('Erro ao atualizar o paciente: ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Paciente atualizado com sucesso')
    })
}

// Deletar pacientes
export const deletePaciente = (req, res) => {
    const q = 'DELETE FROM pacientes WHERE `id` = ?'

    db.query(q, [req.params.id], (err) => {
        if(err) {
            console.log('Erro ao deletar paciente ', err)
            return res.status(500).json(err)
        }
        return res.status(200).json('Paciente deletado com sucesso.')
    })
}