import { db } from '../db.js'

export const postExameConvenios = (req, res) => {
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