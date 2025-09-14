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
        ORDER BY id DESC
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

// Criar novo paciente no sistema
export const addPacientes = (req, res) => {
    const q = 'INSERT INTO pacientes(`nome`,`idade`) VALUES (?)'

    const values = [
        req.body.nome,
        req.body.idade,
    ]

    db.query(q, [values], (err, result) => {
        if (err) {
            console.log('Erro ao adicionar novo paciente. ' + err)
            return res.status(500).json(err)
        }

        // Log para criar um novo exame
        const insertId = result.insertId

        const logQuery = `
            INSERT INTO logpaciente (id_paciente, idade, paciente, tipo_alteracao)
            VALUES (?, ?, ?, 'Insert')
        `

        const logValues = [
            insertId,
            req.body.idade,
            req.body.nome,
        ]

        db.query(logQuery, logValues, (logErr) => {
            if (logErr) {
                console.error('Erro ao registrar paciente. ' + logErr)
                console.log(insertId)
            }
            return res.status(200).json('Paciente criado com sucesso')

        })

    })
}


// Atualizar paciente já existente
export const updatePaciente = (req, res) => {

    const pacienteId = req.params.id;

    // 1. Buscar dados antigos antes do update
    const selectQuery = 'SELECT * FROM pacientes WHERE id = ?'
    db.query(selectQuery, [pacienteId], (selectErr, selectResult) => {
        if (selectErr) {
            console.log('Erro ao buscar exame: ' + selectErr)
            return res.status(500).json(selectErr)
        }

        if (selectResult.length === 0) {
            return res.status(404).json('Exame não encontrado.')
        }

        const oldPaciente = selectResult[0];

        // 2. Atualiar o paciente
        const q = 'UPDATE pacientes SET `nome` = ?, `idade` = ? WHERE `id` = ?'
        const values = [
            req.body.nome,
            req.body.idade,
            pacienteId,
        ]

        db.query(q, values, (updateErr) => {
            if (updateErr) {
                console.log('Erro ao atualizar o paciente: ', updateErr)
                return res.status(500).json(updateErr)
            }

            const logQuery = `
                INSERT INTO logpaciente (id_paciente, idade, paciente, tipo_alteracao)
                VALUES (?, ?, ?, ?)
            `

            const logAntes = [pacienteId, oldPaciente.idade, oldPaciente.nome, 'Update - Antes']
            const logDepois = [pacienteId, req.body.idade, req.body.nome, 'Update - Depois']

            // Inserir o log "antes"
            db.query(logQuery, logAntes, (logErr1) => {
                if (logErr1) {
                    console.error('Erro ao registrar log (antes): ', logErr1)
                }

                db.query(logQuery, logDepois, (logErr2) => {
                    if (logErr2) {
                        console.error('Erro ao registrar log (depois): ' + logErr2)
                    }
                    return res.status(200).json('Paciente atualizado e log de antes/depois registrado.');
                })
            })
        })
    })


}

// Deletar pacientes
export const deletePaciente = (req, res) => {
    const exameId = req.params.id;

    const selectQuery = `SELECT * FROM pacientes WHERE id = ?`

    db.query(selectQuery, [exameId], (selectErr, selectResult) => {
        if (selectErr) {
            console.log('Erro ao buscar paciente: ' + selectErr)
            return res.status(500).json(selectErr)
        }

        if (selectResult.length === 0) {
            return res.status(404).json('Exame não encontrado.')
        }

        const exame = selectResult[0];

        // Deletar paciente
        const q = 'DELETE FROM pacientes WHERE `id` = ?'

        db.query(q, [req.params.id], (err) => {
            if (err) {
                console.log('Erro ao deletar paciente ', err)
                return res.status(500).json(err)
            }

            // Registrar o log de exclusão
            const logQuery = `
                INSERT INTO logpaciente (id_paciente, idade, paciente, tipo_alteracao)
                VALUES ( ?, ?, ?, 'Delete')
            `

            const logValues = [
                exame.id,
                exame.nome,
                exame.idade,
            ]

            db.query(logQuery, logValues, (logErr) => {
                if (logErr) {
                    console.error('Erro ao regostrar log de exclusão: ' + logErr)
                }
                return res.status(200).json('Paciente deletado com sucesso.')

            })
        })
    })
}


export const logPaciente = (req, res) => {
    const dataInicio = req.query.dataInicio || null;
    const dataFinal = req.query.dataFinal || null;
    const tipo = req.query.tipo || null;

    let query = 'SELECT * FROM logpaciente';
    let params = [];
    let conditions = [];

    if (dataInicio && dataFinal) {
        conditions.push('data_alteracao BETWEEN ? AND ?');
        params.push(`${dataInicio} 00:00:00`, `${dataFinal} 23:59:59`);
    }

    if (tipo) {
        conditions.push('tipo_alteracao LIKE ?');
        params.push(`${tipo}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(query, params, (err, data) => {
        if (err) {
            console.log('Erro ao buscar log de pacientes:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        return res.status(200).json(data);
    });
};

// export const logPaciente = (req, res) => {
//     const q = 'SELECT * FROM logpaciente'

//     db.query(q, (err, data) => {
//         if (err) {
//             console.log('Erro ao carregar os logs dos pacientes')
//             return res.status(500).json(err)
//         }
//         return res.status(200).json(data)
//     })
// }