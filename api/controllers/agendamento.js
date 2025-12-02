import { db } from '../db.js'

export const getAgendamentos = (req, res) => {
    try {

        const q = `
        SELECT
    id,
    nome,
    sexo,
    cpf,
    rg,
    DATE_FORMAT(nascimento, '%Y-%m-%d') AS nascimento,
    telefone,
    email,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep,
    DATE_FORMAT(data_consulta, '%d-%m-%Y') AS data_consulta,
    horario,
    tipo_consulta,
    retorno,
    observacao
FROM agendamento;
        ;
    `

        db.query(q, (err, data) => {
            if (err) {
                res.status(500).json('Erro interno no servidor')
            }
            res.status(200).json(data)
        })
    } catch (err) {
        console.error('Erro interno no servidor')
    }
}


export const agendarConsulta = (req, res) => {
    try {

        const { nome, sexo, cpf, rg, nascimento, telefone, email, rua, numero, bairro, cidade, estado, cep, data_consulta, horario, tipo_consulta, retorno, observacao } = req.body;

        const values = [
            nome,
            sexo,
            cpf,
            rg,
            nascimento,
            telefone,
            email,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            data_consulta,
            horario,
            tipo_consulta,
            retorno,
            observacao
        ]

        const q = `
            INSERT INTO agendamento (nome, sexo, cpf, rg, nascimento, telefone, email, rua, numero, bairro, cidade, estado, cep, data_consulta, horario, tipo_consulta, retorno, observacao) VALUES
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        if (!nome || !sexo || !nascimento || !telefone || !cep || !data_consulta || !horario || !tipo_consulta || !retorno) {
            return res.status(400).json({ error: 'Todos os campos obrigatorios devem preenchidos.' })
        }

        db.query(q, values, (err, data) => {
            if (err) {
                res.status(500).json('Erro interno no servidor')
            }
            res.status(201).json('Agendamento cadastrado com sucesso')
        })

    } catch (error) {
        console.error('Erro interno no servidor')
    }
}


export const alterarConsulta = (req, res) => {
    try {

        const id = req.params.id;
        const { nome, sexo, cpf, rg, nascimento, telefone, email, rua, numero, bairro, cidade, estado, cep, data_consulta, horario, tipo_consulta, retorno, observacao } = req.body;

        const values = [
            nome,
            sexo,
            cpf,
            rg,
            nascimento,
            telefone,
            email,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            data_consulta,
            horario,
            tipo_consulta,
            retorno,
            observacao,
            id
        ]

        const q = `
            UPDATE agendamento
SET 
    nome = ?,
    sexo = ?,
    cpf = ?,
    rg = ?,
    nascimento = ?,
    telefone = ?,
    email = ?,
    rua = ?,
    numero = ?,
    bairro = ?,
    cidade = ?,
    estado = ?,
    cep = ?,
    data_consulta = ?,
    horario = ?,
    tipo_consulta = ?,
    retorno = ?,
    observacao = ?
WHERE id = ?;
        `

        if (!nome || !sexo || !nascimento || !telefone || !cep || !data_consulta || !horario || !tipo_consulta || !retorno) {
            return res.status(400).json({ error: 'Todos os campos obrigatorios devem preenchidos.' })
        }

        db.query(q, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno no servidor' })
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Consulta não encontrada ou não foi alterada' })
            }

            res.status(200).json('Alteração realizada com sucesso')
        })

    } catch (error) {
        console.error('Erro interno no servidor')
    }
}


export const deletarDaAgenda = (req, res) => {
    try {

        const id = req.params.id

        const q = `
            DELETE FROM agendamento
            WHERE id = ?;
        `

        db.query(q, id, (err, result) => {
            if (err) {
                return res.status(500).json('Erro interno no servidor')
            }
            res.status(200).json('Consulta excluida com sucesso')
        })

    } catch (error) {
        console.error('Erro interno no servidor')
    }
}