import { db } from '../db.js'

// Pesquisando convenios
export const getConvenio = (req, res) => {

    const {
        cod,
        nome,
        limit = 20,
        page = 1
    } = req.query;

    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safePage = Number(page) || 1;
    const offset = (safePage - 1) * safeLimit;

    // ============================
    // 📄 DADOS
    // ============================

    let dataQuery = `
        SELECT
            id,
            cod,
            nome
        FROM convenio
        WHERE 1=1
    `;

    const dataParams = [];

    // Filtro por código
    if (cod) {
        dataQuery += ' AND cod LIKE ?';
        dataParams.push(`%${cod}%`);
    }

    // Filtro por nome
    if (nome) {
        dataQuery += ' AND nome LIKE ?';
        dataParams.push(`%${nome}%`);
    }

    // Paginação
    dataQuery += ' LIMIT ? OFFSET ?';
    dataParams.push(safeLimit, offset);

    db.query(dataQuery, dataParams, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Erro ao buscar convênios"
            });
        }

        return res.status(200).json(rows);
    });

};



// Criando convenio
export const createConvenio = (req, res) => {
    try {

        const q = `
        INSERT INTO convenio (cod, nome) VALUES
        (?, ?)
    `

        const { cod, nome } = req.body;

        if (!cod || !nome) {
            return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' })
        }

        db.query(q, [cod, nome], (err, result) => {
            if (err) {

                if (err.code == 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Já existe um convênio com esse código.' })
                }
                console.error(err)
                return res.status(500).json({ error: 'Erro interno no servidor' })
            }

            return res.status(201).json({
                mensagem: 'Convênio cadastrado com sucesso!'
            })

        })
    } catch (err) {
        console.error('Erro interno no servidor' + err)
    }

}


export const updateConvenio = (req, res) => {
    try {

        const values = [
            req.body.cod,
            req.body.nome
        ];

        const q = `
            UPDATE convenio
            SET cod = ?, nome = ?
            WHERE id = ?
        `

        db.query(q, [...values, req.params.id], (err, result) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Já existe um convênio com esse código.' })
                }
                console.error(err)
                return res.status(500).json({ error: 'Erro ao atualizar convênio.' })
            }
            return res.status(200).json({ mensagem: 'Convênio atualizado com sucesso!' })
        })
    } catch (err) {
        return res.status(500).json({
            error: 'Erro interno no servidor'
        })
    }
}

export const deleteConvenio = (req, res) => {

    const q = `
        DELETE FROM convenio
        WHERE id = ?
    `

    db.query(q, [req.params.id], (err, result) => {
        if (err) {
            if (err.code == 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({
                    error: 'Não é possivel excluir esse convenio pois esta vinculado a exames.'
                })
            }
            return res.status(500).json({
                error: 'Erro ao deletar convênio.'
            })
        }
        return res.status(200).json({
            mensagem: 'Convênio excluido com sucesso!'
        })
    })

}