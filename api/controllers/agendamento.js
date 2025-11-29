import { db } from '../db.js'

export const getAgendamentos = (req, res) => {
    try {

        const q = `
        SELECT * FROM agendamento;
    `

        db.query(q, (err, data) => {
            if (err) {
                res.status(500).json('Erro interno no servidor')
            } else if (data.length === 0) {
                res.status(200).json('Nenhum cadastrado encontrado no momento')
            }
            res.status(200).json(data)
        })
    } catch (err) {
        console.error('Erro interno no servidor')
    }
}


export const agendarConsulta = (req, res) => {
    try {

        const {nome, sexo, cpf, rg, nascimento, telefone, email, rua, numero, bairro, cidade, estado, cep, data_consulta, horario, tipo_consulta, retorno, observacao } = req.body;

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

        if ( !nome || !sexo || !nascimento || !telefone || !cep || !data_consulta || !horario || !tipo_consulta || !retorno ) {
            return res.status(400).json({error: 'Todos os campos obrigatorios devem preenchidos.'})
        }

        db.query(q, values, (err, data) => {
            if(err) {
                res.status(500).json('Erro interno no servidor')
            }
            res.status(201).json('Agendamento cadastrado com sucesso')
        })

    } catch (error) {
        console.error('Erro interno no servidor')
    }
}