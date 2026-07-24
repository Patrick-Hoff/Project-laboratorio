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


// Log do exame
export const logExames = (req, res) => {
    const dataInicio = req.query.dataInicio || null;
    const dataFinal = req.query.dataFinal || null;
    const tipo = req.query.tipo || null;

    // let query = 'SELECT * FROM logexame';
    let query = `
    SELECT
        log.logid,
        log.log_date,
        log.entidade_tipo,
        log.entidade_id,
        log.alteracao,
        log.valor,
        users.id   AS userid,
        users.name AS user
    FROM log
    INNER JOIN users ON log.userid = users.id
`;
    let params = [];
    let conditions = [];

    if (dataInicio && dataFinal) {
        conditions.push('log_date BETWEEN ? AND ?');
        params.push(`${dataInicio} 00:00:00`, `${dataFinal} 23:59:59`);
    }

    if (tipo) {
        conditions.push('entidade_tipo = ?');
        params.push(`${tipo}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(query, params, (err, data) => {
        if (err) {
            console.log('Erro ao buscar log de exames:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        const logsFormatados = data.map((row) => {
            // se a coluna for JSON, o mysql2 já pode devolver objeto; se vier string, faz o parse
            const valorJson = typeof row.valor === 'string'
                ? JSON.parse(row.valor)
                : row.valor;

            return {
                logid: row.logid,
                date: formatarData(row.log_date),
                valor: {
                    update: {
                        alteracao: row.alteracao // "Update" | "Create" | "Delete"
                    },
                    ...valorJson, // espalha antes/depois (update) OU create OU delete
                    user: {
                        userid: row.userid,
                        user: row.user
                    }
                }
            };
        });

        return res.status(200).json(logsFormatados);
    });

    function formatarData(data) {
        const d = new Date(data);

        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();

        const horas = String(d.getHours()).padStart(2, '0');
        const minutos = String(d.getMinutes()).padStart(2, '0');
        const segundos = String(d.getSeconds()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    }
};
