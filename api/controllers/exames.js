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
        ORDER BY id DESC
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
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            if (transactionErr) {
                return res.status(500).json(transactionErr);
            }
        }

        const query = `
        INSERT INTO exames (cod, nome, dupExame)
        VALUES (?, ?, ?)
    `

        const values = [
            req.body.cod,
            req.body.nome,
            req.body.dupExame
        ]

        db.query(query, values, (insertErr, result) => {
            if (insertErr) {
                return db.rollback(() => {
                    res.status(500).json(insertErr)
                })
            }

            const insertId = result.insertId

            // LOG
            const logQuery = `
            INSERT INTO log
            (entidade_tipo, entidade_id, userid, alteracao, valor)
            VALUES (?, ?, ?, ?, ?)
        `

            const logValues = [
                'exame',
                insertId,
                req.userId,
                'Create',
                JSON.stringify({
                    create: {
                        exameid: insertId,
                        codigo: req.body.cod,
                        exame: req.body.nome,
                        duplicar: req.body.dupExame
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
                        res.status(500).json(logErr)
                    });
                }
                res.status(200).json('Exame criado com sucesso.')
            })
        })
    })

}

// Update exame
export const updateExame = (req, res) => {
    const exameId = req.params.id;

    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.status(500).json(transactionErr);
        }

        const selectQuery = 'SELECT * FROM exames WHERE id = ?';

        db.query(selectQuery, [exameId], (selectErr, selectResult) => {
            if (selectErr) {
                return db.rollback(() => {
                    res.status(500).json(selectErr);
                });
            }

            if (selectResult.length === 0) {
                return db.rollback(() => {
                    res.status(404).json("Exame não encontrado.");
                });
            }

            const oldExame = selectResult[0];

            const updateQuery = `
                UPDATE exames
                SET cod = ?, nome = ?, dupExame = ?
                WHERE id = ?
            `;

            const updateValues = [
                req.body.cod,
                req.body.nome,
                req.body.dupExame,
                exameId
            ];

            db.query(updateQuery, updateValues, (updateErr) => {
                if (updateErr) {
                    return db.rollback(() => {
                        res.status(500).json(updateErr);
                    });
                }

                const logQuery = `
                    INSERT INTO log
                    (entidade_tipo, entidade_id, userid, alteracao, valor)
                    VALUES (?, ?, ?, ?, ?)
                `;

                const logValues = [
                    'exame',
                    exameId,
                    req.userId,
                    'Update',
                    JSON.stringify({
                        antes: {
                            exameid: oldExame.id,
                            codigo: oldExame.cod,
                            exame: oldExame.nome,
                            duplicar: oldExame.dupExame
                        },
                        depois: {
                            exameid: oldExame.id,
                            codigo: req.body.cod,
                            exame: req.body.nome,
                            duplicar: req.body.dupExame
                        }
                    })
                ];

                db.query(logQuery, logValues, (logErr) => {
                    if (logErr) {
                        return db.rollback(() => {
                            res.status(500).json(logErr);
                        });
                    }

                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                res.status(500).json(commitErr);
                            });
                        }

                        res.status(200).json("Exame atualizado com sucesso.");
                    });
                });
            });
        });
    });
};


// Deletar exame
export const deleteExame = (req, res) => {
    const exameId = req.params.id;

    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return db.rollback(() => {
                res.status(500).json(transactionErr)
            })
        }

        const selectQuery = 'SELECT * FROM exames WHERE id = ?';
        db.query(selectQuery, [exameId], (selectErr, selectResult) => {
            if (selectErr) {
                return db.rollback(() => {
                    res.status(500).json(selectErr)
                })
            }

            if (selectResult.length === 0) {
                return res.status(404).json("Exame não encontrado.")
            }

            const exame = selectResult[0];

            const deleteQuery = 'DELETE FROM exames WHERE id = ?';
            db.query(deleteQuery, [exameId], (deleteErr) => {
                if (deleteErr) {
                    return db.rollback(() => {
                        res.status(500).json(deleteErr);
                    })
                }

                const logQuery = `
                    INSERT INTO log
                    (entidade_tipo, entidade_id, userid, alteracao, valor)
                    VALUES (?, ?, ?, ?, ?)
            `;

                const logValues = [
                    'exame',
                    exameId,
                    req.userId,
                    'Delete',
                    JSON.stringify({
                        delete: {
                            exameid: exameId,
                            codigo: exame.cod,
                            exame: exame.nome,
                            duplicar: exame.dupExame
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

                        res.status(200).json("Exame deletado com sucesso.")
                    })
                });
            });
        });
    })

};