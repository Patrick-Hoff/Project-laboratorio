import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_supersecreto'

// Registro
export const registerUser = (req, res) => {
    const { name, email, password, isAdmin } = req.body

    const q = 'SELECT * FROM users WHERE email = ?'
    db.query(q, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no banco de dados' })
        if (results.length > 0) return res.status(400).json({ error: 'Email já cadastrado' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const insert = 'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)'
        db.query(insert, [name, email, hashedPassword, isAdmin], (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao cadastrar.' })
            res.status(201).json({ message: 'Usuário cadastrado com sucesso' })
        })
    })
}

// Atualização
export const updateUser = (req, res) => {
    const userId = req.params.id;

    const selectQuery = `SELECT * FROM users WHERE id = ?`;
    db.query(selectQuery, [userId], (selectErr, result) => {
        if (selectErr) return res.status(500).json(selectErr);
        if (result.length === 0) return res.status(404).json('Usuário não encontrado.');

        const { name, email, password, isAdmin } = req.body;

        // Atualiza com ou sem senha
        let q, values;
        if (password) {
            bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                if (hashErr) return res.status(500).json(hashErr);
                q = `UPDATE users SET name = ?, email = ?, password = ?, isAdmin = ? WHERE id = ?`;
                values = [name, email, hashedPassword, isAdmin, userId];
                db.query(q, values, (updateErr) => {
                    if (updateErr) return res.status(500).json(updateErr);
                    return res.status(200).json('Dados do usuário atualizados com sucesso');
                });
            });
        } else {
            q = `UPDATE users SET name = ?, email = ?, isAdmin = ? WHERE id = ?`;
            values = [name, email, isAdmin, userId];
            db.query(q, values, (updateErr) => {
                if (updateErr) return res.status(500).json(updateErr);
                return res.status(200).json('Dados do usuário atualizados com sucesso');
            });
        }
    });
};

// Login
export const loginUser = (req, res) => {
    const { email, password } = req.body

    const q = 'SELECT * FROM users WHERE email = ?'
    db.query(q, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no banco de dados' })
        if (results.length === 0) return res.status(401).json({ error: 'Email ou senha incorretos' })

        const user = results[0]

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ error: 'Email ou senha incorretos' })

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        })

        res.status(200).json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    })
}

// Busca com filtro
export const searchUsers = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const searchId = req.query.searchId || '';
    const searchNome = req.query.searchName || '';
    const searchEmail = req.query.searchEmail || '';

    const countQuery = `
        SELECT COUNT(*) AS total FROM users 
        WHERE id LIKE ? AND name LIKE ? AND email LIKE ?`;

    const dataQuery = `
        SELECT id, name, email, isAdmin FROM users
        WHERE id LIKE ? AND name LIKE ? AND email LIKE ?
        LIMIT ? OFFSET ?`;

    const likeId = `%${searchId}%`;
    const likeNome = `%${searchNome}%`;
    const likeEmail = `%${searchEmail}%`;

    db.query(countQuery, [likeId, likeNome, likeEmail], (err, countResult) => {
        if (err) return res.status(500).json(err);

        const total = countResult[0].total;

        db.query(dataQuery, [likeId, likeNome, likeEmail, limit, offset], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ data, total });
        });
    });
};

export const getCurrentUser = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Não autenticado' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const q = 'SELECT id, name, email, isAdmin, profileImage FROM users WHERE id = ?';
        db.query(q, [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Erro no banco' });
            if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

            const user = results[0];
            const avatarUrl = user.profileImage ? `http://localhost:8081/uploads/${user.profileImage}` : null;

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                avatar: avatarUrl
            });
        });
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
}


export const logoutSistem = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    })
    res.json({ message: 'Logout realizado com sucesso' })
}



// controllers/usuarios.js
export const uploadUserImage = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Não autenticado' });

    const imagem = req.file?.filename;
    if (!imagem) {
        return res.status(400).json({ erro: 'Nenhuma imagem enviada.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Primeiro buscar imagem antiga para deletar (se desejar)
        const qSelect = 'SELECT profileImage FROM users WHERE id = ?';
        db.query(qSelect, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar usuário' });

            const imagemAntiga = result[0]?.profileImage;
            if (imagemAntiga) {
                const filePath = path.join('public/uploads', imagemAntiga);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Atualiza o nome da imagem no banco
            const qUpdate = 'UPDATE users SET profileImage = ? WHERE id = ?';
            db.query(qUpdate, [imagem, userId], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao salvar imagem' });

                const imageUrl = `/uploads/${imagem}`;
                res.json({
                    mensagem: 'Imagem enviada e associada ao usuário com sucesso.',
                    avatarUrl: `http://localhost:8081${imageUrl}`
                });
            });
        });

    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
}

