import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: 'Não autenticado' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // PADRÃO ÚNICO
        req.userId = decoded.id

        next()
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' })
    }
}
