import { db } from '../db.js'

export const logsGrid = (req, res) => {
    const logPage = req.params.page;

    const dataInicio = req.query.dataInicio || null;
    const dataFinal = req.query.dataFinal || null;
    const tipo = req.query.tipo || null;

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

    conditions.push('log.entidade_tipo = ?');
    params.push(`${logPage}`);

    if (dataInicio && dataFinal) {
        conditions.push('log.log_date BETWEEN ? AND ?');
        params.push(`${dataInicio} 00:00:00`, `${dataFinal} 23:59:59`);
    }

    if (tipo) {
        conditions.push('log.alteracao = ?');
        params.push(`${tipo}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(query, params, (err, data) => {
        if (err) {
            console.log('Erro ao buscar log de pacientes:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        const logsFormatados = data.map((row) => {
            // se a coluna for JSON, o mysql2 já pode devolver objeto; se vier string, faz o parse
            const valorJson = typeof row.valor === 'string'
                ? JSON.parse(row.valor)
                : row.valor

            return {
                logid: row.logid,
                date: formatarData(row.log_date),
                valor: {
                    update: {
                        alteracao: row.alteracao
                    },
                    ...valorJson,
                    user: {
                        userid: row.userid,
                        user: row.user
                    }
                }
            };
        })

        return res.status(200).json(logsFormatados)

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