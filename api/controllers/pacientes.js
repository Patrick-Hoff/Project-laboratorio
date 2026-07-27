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
        SELECT 
    id, 
    nome,
    idade
FROM pacientes
WHERE id LIKE ? 
  AND nome LIKE ?
ORDER BY id DESC
LIMIT ? OFFSET ?; `


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
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.status(500).json(transactionErr);
        }

        const query = 'INSERT INTO pacientes(`nome`,`idade`) VALUES (?, ?)'

        const values = [
            req.body.nome,
            req.body.idade,
        ]

        db.query(query, values, (insertErr, result) => {
            if (insertErr) {
                return db.rollback(() => {
                    res.status(500).json(insertErr)
                })
            }

            const insertId = result.insertId

            const logQuery = `
            INSERT INTO log
            (entidade_tipo, entidade_id, userid, alteracao, valor)
            VALUES (?, ?, ?, ?, ?)
        `

            const logValues = [
                'paciente',
                insertId,
                req.userId,
                'Create',
                JSON.stringify({
                    create: {
                        pacienteid: insertId,
                        nome: req.body.nome,
                        nascimento: req.body.idade
                    }
                })
            ]

            db.query(logQuery, logValues, (logErr) => {
                if (logErr) {
                    return db.rollback(() => {
                        res.status(500).json(logErr)
                    })
                }
            })

            db.commit((commitErr) => {
                if (commitErr) {
                    return db.rollback(() => {
                        res.status(500).json(commitErr)
                    })
                }

                res.status(200).json('Paciente criado com sucesso.')
            })

        })

    })

}


// Atualizar paciente já existente
export const updatePaciente = (req, res) => {

    const pacienteId = req.params.id;

    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.status(500).json(transactionErr);
        }

        const selectQuery = 'SELECT * FROM pacientes WHERE id = ?'

        db.query(selectQuery, [pacienteId], (selectErr, selectResult) => {
            if (selectErr) {
                return db.rollback(() => {
                    res.status(500).json(selectErr)
                })
            };

            if (selectResult.length === 0) {
                return db.rollback(() => {
                    res.status(500).json('Exame não encontrado.')
                });
            }

            const oldPaciente = selectResult[0];

            const q = 'UPDATE pacientes SET `nome` = ?, `idade` = ? WHERE `id` = ?'
            const values = [
                req.body.nome,
                req.body.idade,
                pacienteId,
            ]

            db.query(q, values, (updateErr) => {
                if (updateErr) {
                    return db.rollback(() => {
                        res.status(500).json(updateErr);
                    });
                }

                const logQuery = `
                INSERT INTO log (entidade_tipo, entidade_id, userid, alteracao, valor)
                VALUES (?, ?, ?, ?, ?)
            `


                const logValues = [
                    'paciente',
                    pacienteId,
                    req.userId,
                    'Update',
                    JSON.stringify({
                        antes: {
                            pacienteid: oldPaciente.id,
                            nome: oldPaciente.nome,
                            nascimento: oldPaciente.idade
                        },
                        depois: {
                            pacienteid: oldPaciente.id,
                            nome: req.body.nome,
                            nascimento: req.body.idade
                        }
                    })
                ];

                db.query(logQuery, logValues, (logErr) => {
                    if (logErr) {
                        return db.rollback(() => {
                            res.status(500).json(logErr)
                        })
                    }

                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                res.status(500).json(commitErr)
                            })
                        }

                        res.status(200).json("Paciente atualizado com sucesso.")
                    })
                })
            })
        })
    })
}

// Deletar pacientes
export const deletePaciente = (req, res) => {
    const pacienteId = req.params.id;

    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return db.rollback(() => {
                res.status(500).json(transactionErr);
            })
        }

        const selectQuery = `SELECT * FROM pacientes WHERE id = ?`

        db.query(selectQuery, [pacienteId], (selectErr, selectResult) => {
            if (selectErr) {
                return db.rollback(() => {
                    res.status(500).json(selectErr)
                })
            }

            if (selectResult.length === 0) {
                return res.status(404).json('Paciente não encontrado.')
            }

            const paciente = selectResult[0];

            const deleteQuery = 'DELETE FROM pacientes WHERE `id` = ?'

            db.query(deleteQuery, [pacienteId], (deleteErr) => {
                if (deleteErr) {
                    return db.rollback(() => {
                        res.status(500).json(deleteErr)
                    })
                }

                const logQuery = `
                    INSERT INTO log
                    (entidade_tipo, entidade_id, userid, alteracao, valor)
                    VALUES (?, ?, ?, ?, ?)
            `

                const logValues = [
                    'paciente',
                    pacienteId,
                    req.userId,
                    'Delete',
                    JSON.stringify({
                        delete: {
                            pacienteid: pacienteId,
                            nome: paciente.nome,
                            nascimento: paciente.idade,
                        }
                    })
                ];

                db.query(logQuery, logValues, (logErr) => {
                    if (logErr) {
                        return db.rollback(() => {
                            res.status(500).json(logErr)
                        })
                    }

                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                res.status(500).json(commitErr)
                            })
                        }
                        res.status(200).json('Paciente deletado com sucesso.')
                    })
                })
            })
        })
    })
}