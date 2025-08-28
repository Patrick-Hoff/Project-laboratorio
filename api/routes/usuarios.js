import express from 'express'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
    registerUser,
    loginUser,
    searchUsers,
    getCurrentUser,
    logoutSistem,
    updateUser,
    uploadUserImage // Função para lidar com o upload da imagem
} from '../controllers/usuarios.js'

// Workaround para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Garante que a pasta de upload existe
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

// Criando o router
const router = express.Router()

// Rota de upload da imagem
router.post('/upload', upload.single('imagem'), uploadUserImage)

// Outras rotas
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/searchUsers', searchUsers)
router.get('/me', getCurrentUser)
router.post('/logout', logoutSistem)
router.put('/edit/:id', updateUser)

export default router