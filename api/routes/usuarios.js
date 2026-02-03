import express from 'express'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { verifyToken } from '../middlewares/auth.js'
import {
    registerUser,
    loginUser,
    searchUsers,
    getCurrentUser,
    logoutSistem,
    updateUser,
    uploadUserImage
} from '../controllers/usuarios.js'

// Resolver __dirname (ES Modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Pasta de uploads
const uploadDir = path.join(__dirname, '..', 'public/uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

const router = express.Router()

// 🔒 UPLOAD (somente usuário logado)
router.post('/upload', verifyToken, upload.single('imagem'), uploadUserImage)

// Públicas
router.post('/register', registerUser)
router.post('/login', loginUser)

// 🔒 Protegidas
router.get('/me', verifyToken, getCurrentUser)
router.post('/logout', verifyToken, logoutSistem)
router.put('/edit/:id', verifyToken, updateUser)
router.get('/searchUsers', searchUsers)

export default router
