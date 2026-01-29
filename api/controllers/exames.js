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
    const q = `
        INSERT INTO exames (cod, nome, valor)
        VALUES (?, ?, ?)
    `

    const values = [
        req.body.cod,
        req.body.nome,
        req.body.valor || 0
    ]

    db.query(q, values, (err, result) => {
        if (err) {
            console.error('Erro ao adicionar exame:', err)
            return res.status(500).json(err)
        }

        const insertId = result.insertId

        // LOG
        const logQuery = `
            INSERT INTO logexame
            (id_exame, cod, exame, valor, tipo_alteracao, id_user)
            VALUES (?, ?, ?, ?, ?, ?)
        `

        const logValues = [
            insertId,
            req.body.cod,
            req.body.nome,
            req.body.valor || 0,
            'Insert',
            req.userId
        ]

        db.query(logQuery, logValues, (logErr) => {
            if (logErr) {
                console.error('Erro ao registrar log do exame:', logErr)
            }
        })

        return res.status(201).json({
            message: 'Exame criado com sucesso',
            id: insertId
        })
    })
}

// Atualizar exame
export const updateExame = (req, res) => {
    const exameId = req.params.id;

    // 1. Buscar dados antigos antes do update
    const selectQuery = 'SELECT * FROM exames WHERE id = ?';
    db.query(selectQuery, [exameId], (selectErr, selectResult) => {
        if (selectErr) {
            console.log('Erro ao buscar exame: ', selectErr);
            return res.status(500).json(selectErr);
        }

        if (selectResult.length === 0) {
            return res.status(404).json('Exame não encontrado.');
        }

        const oldExame = selectResult[0];

        // 2. Atualizar o exame
        const updateQuery = 'UPDATE exames SET `cod` = ?, `nome` = ?, `valor` = ? WHERE `id` = ?';
        const values = [req.body.cod, req.body.nome, req.body.valor, exameId];

        db.query(updateQuery, values, (updateErr) => {
            if (updateErr) {
                console.log('Erro ao atualizar o exame: ', updateErr);
                return res.status(500).json(updateErr);
            }

            // 3. Inserir dois logs: "Update - Antes" e "Update - Depois"
            const logQuery = `
                INSERT INTO logexame (id_exame, cod, exame,  valor, tipo_alteracao, id_user)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const logAntes = [exameId, oldExame.cod, oldExame.nome, oldExame.valor, 'Update - Antes', req.userId];
            const logDepois = [exameId, req.body.cod, req.body.nome, req.body.valor, 'Update - Depois', req.userId];

            // Inserir o log "antes"
            db.query(logQuery, logAntes, (logErr1) => {
                if (logErr1) {
                    console.error('Erro ao registrar log (antes):', logErr1);
                    // Continua para tentar registrar o "depois"
                }

                // Inserir o log "depois"
                db.query(logQuery, logDepois, (logErr2) => {
                    if (logErr2) {
                        console.error('Erro ao registrar log (depois):', logErr2);
                    }

                    return res.status(200).json('Exame atualizado e log de antes/depois registrado.');
                });
            });
        });
    });
};


// Deletar exame
export const deleteExame = (req, res) => {
    const exameId = req.params.id;

    // 1. Buscar dados do exame antes de deletar
    const selectQuery = 'SELECT * FROM exames WHERE id = ?';
    db.query(selectQuery, [exameId], (selectErr, selectResult) => {
        if (selectErr) {
            console.log('Erro ao buscar exame: ', selectErr);
            return res.status(500).json(selectErr);
        }

        if (selectResult.length === 0) {
            return res.status(404).json('Exame não encontrado.');
        }

        const exame = selectResult[0];

        // 2. Deletar o exame
        const deleteQuery = 'DELETE FROM exames WHERE id = ?';
        db.query(deleteQuery, [exameId], (deleteErr) => {
            if (deleteErr) {
                console.log('Erro ao deletar exame: ', deleteErr);
                return res.status(500).json(deleteErr);
            }

            // 3. Registrar o log da exclusão
            const logQuery = `
                INSERT INTO logexame (id_exame, cod, exame, valor, tipo_alteracao, id_user)
                VALUES (?, ?, ?, ?, 'Delete', ?)
            `;

            const logValues = [
                exame.id,
                exame.cod,
                exame.nome,
                exame.valor,
                req.userId
            ];

            db.query(logQuery, logValues, (logErr) => {
                if (logErr) {
                    console.error('Erro ao registrar log de exclusão: ', logErr);
                    // Continua mesmo que falhe o log
                }

                return res.status(200).json('Exame deletado com sucesso e log registrado.');
            });
        });
    });
};


// Log do exame
export const logExames = (req, res) => {
    const dataInicio = req.query.dataInicio || null;
    const dataFinal = req.query.dataFinal || null;
    const tipo = req.query.tipo || null;

    // let query = 'SELECT * FROM logexame';
    let query = `
    select
	logexame.id_log,
    logexame.id_exame,
    logexame.cod,
    logexame.exame,
    logexame.data_alteracao,
    logexame.tipo_alteracao,
    logexame.valor,
    users.id,
    users.name
    from logexame
INNER JOIN users ON logexame.id_user = users.id`
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
            console.log('Erro ao buscar log de exames:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        return res.status(200).json(data);
    });
};
