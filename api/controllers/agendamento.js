import { db } from '../db.js'

// http://localhost:8081/agendamentos        # Endpoint da API de agendamentos
// ?nome=ana                                # Filtra pacientes que contenham "ana" no nome
// &proximos=true                           # Retorna apenas consultas futuras
// &orderBy=data_consulta                  # Ordena pelo campo data da consulta
// &orderDir=ASC                            # Ordenação crescente (mais próximos primeiro)
// &limit=20                                # Limita o retorno para 20 registros
// &page=1                                 # Página 1 da paginação

export const getAgendamentos = (req, res) => {
    const {
        id,
        nome,
        data,
        proximos,
        orderBy = "id",
        orderDir = "DESC",
        limit = 20,
        page = 1
    } = req.query;

    const safeLimit = Math.min(Number(limit), 100);
    const offset = (Number(page) - 1) * safeLimit;

    let countQuery = `
        SELECT COUNT(*) AS total
        FROM agendamento
        WHERE 1=1
    `;
    const countParams = [];

    if (id) {
        countQuery += " AND id = ?";
        countParams.push(id);
    }

    if (nome) {
        countQuery += " AND nome LIKE ?";
        countParams.push(`%${nome}%`);
    }

    if (data) {
        countQuery += " AND data_consulta = ?";
        countParams.push(data);
    }

    if (proximos === "true") {
        countQuery += `
            AND data_consulta = CURDATE()
            AND horario >= CURTIME()
        `;
    }

    // ============================
    // 📄 DADOS
    // ============================
    let dataQuery = `
        SELECT
            id,
            nome,
            sexo,
            cpf,
            rg,
            DATE_FORMAT(nascimento, '%d/%m/%Y') AS nascimento,
            telefone,
            email,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            DATE_FORMAT(data_consulta, '%d/%m/%Y') AS data_consulta,
            DATE_FORMAT(horario, '%H:%i') AS horario,
            tipo_consulta,
            retorno,
            observacao
        FROM agendamento
        WHERE 1=1
    `;
    const dataParams = [];

    if (id) {
        dataQuery += " AND id = ?";
        dataParams.push(id);
    }

    if (nome) {
        dataQuery += " AND nome LIKE ?";
        dataParams.push(`%${nome}%`);
    }

    if (data) {
        dataQuery += " AND data_consulta = ?";
        dataParams.push(data);
    }

    if (proximos === "true") {
        dataQuery += `
            AND data_consulta = CURDATE()
            AND horario >= CURTIME()
        `;
    }

    if (proximos === "true") {
        dataQuery += `
            ORDER BY horario ASC
        `;
    } else {
        const allowedOrderBy = ["id", "data_consulta"];
        const allowedOrderDir = ["ASC", "DESC"];

        const orderField = allowedOrderBy.includes(orderBy) ? orderBy : "id";
        const orderDirection = allowedOrderDir.includes(orderDir.toUpperCase())
            ? orderDir.toUpperCase()
            : "DESC";

        if (orderField === "data_consulta") {
            dataQuery += `
                ORDER BY data_consulta ${orderDirection}, horario ${orderDirection}
            `;
        } else {
            dataQuery += ` ORDER BY ${orderField} ${orderDirection}`;
        }
    }

    dataQuery += " LIMIT ? OFFSET ?";
    dataParams.push(safeLimit, offset);

    db.query(countQuery, countParams, (err, countResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao contar registros" });
        }

        const total = countResult[0].total;

        db.query(dataQuery, dataParams, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro ao buscar agendamentos" });
            }

            return res.status(200).json({
                data: id ? rows[0] : rows,
                total
            });
        });
    });
};



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