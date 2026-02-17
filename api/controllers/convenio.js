import { db } from '../db.js'

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