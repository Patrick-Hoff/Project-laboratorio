import { db } from '../db.js'

export const getExameConvenio = (req, res) => {
    const {
        cod,
        exame,
        convenio,
        limit = 10,
        page = 1
    } = req.query;

    let q = `
        SELECT 
            exame_convenio.id,
            exames.cod AS exame_cod,
            exames.nome AS exame,
            convenio.cod AS convenio_cod,
            convenio.nome AS convenio
        FROM exame_convenio
        INNER JOIN exames
            ON exame_convenio.exame_id = exames.id
        INNER JOIN convenio
            ON exame_convenio.convenio_id = convenio.id
        WHERE 1=1
    `;

    const safeLimit = Math.min(Number(limit) || 10, 100);
    const offset = (Number(page) - 1) * safeLimit;

    const dataParams = [];

    if (cod) {
        q += " AND exames.cod LIKE ?";
        dataParams.push(`${cod}%`);
    }

    if (exame) {
        q += " AND exames.nome LIKE ?";
        dataParams.push(`${exame}%`);
    }

    if (convenio) {
        q += " AND convenio.cod LIKE ?";
        dataParams.push(`${convenio}%`);
    }

    q += " LIMIT ? OFFSET ?";
    dataParams.push(safeLimit, offset);

    db.query(q, dataParams, (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
};


export const postExameConvenio = (req, res) => {
    try {

        const {
            convenio_id,
            exame_id,
            valor
        } = req.body;

        const values = [
            convenio_id,
            exame_id,
            valor
        ]

        const q = `
            INSERT INTO exame_convenio (convenio_id, exame_id, valor) VALUES
            (?, ?, ?);
        `

        if (!convenio_id || !exame_id || valor == null) {
            return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' })
        }

        db.query(q, values, (err, data) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        error: 'Este registro já existe para esse convênio e exame.'
                    })
                }

                return res.status(500).json({ error: 'Erro interno no servidor' })
            }

            return res.status(201).json({ mensagem: 'Valor criado com sucesso.' })
        })

    } catch (err) {
        console.error('Erro interno no servidor.')
    }
}


export const updateExameConvenio = (req, res) => {

    const { valor } = req.body;

    const q = `
        UPDATE exame_convenio
        SET valor = ?
        WHERE id = ?
    `;

    db.query(q, [valor, req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: 'Erro interno no servidor.' + err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Registro não encontrado.'
            });
        }

        return res.status(200).json({
            mensagem: 'Valor atualizado com sucesso!'
        });
    });
};


export const deleteExameConvenio = (req, res) => {

    const q = `
        DELETE FROM exame_convenio
        WHERE id = ?
    `

    db.query(q, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({
                error: 'Erro interno no servidor.'
            })
        }
        return res.status(200).json('Valor deletado do convenio com sucesso!')
    })

}