import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pacientesRoutes from './routes/pacientes.js'
import exames_atendimentoRoutes from './routes/exames_atendimento.js'
import examesRoutes from './routes/exames.js'
import atendimentosRoutes from './routes/atendimentos.js'
import usuariosRoutes from './routes/usuarios.js'
import pagamentosRoutes from './routes/pagamentos.js'
import dashboardRoutes from './routes/dashboard.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'  // 👈 Adicionado

dotenv.config()

// 👇 Solução para __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// 👇 Servir imagens corretamente
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'O CORS não permite essa origem.'
            return callback(new Error(msg), false)
        }
        return callback(null, true)
    },
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('API online')
})

app.use('/pacientes', pacientesRoutes)
app.use('/exames_atendimento', exames_atendimentoRoutes)
app.use('/exames', examesRoutes)
app.use('/atendimentos', atendimentosRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/pagamentos', pagamentosRoutes)
app.use('/dashboard', dashboardRoutes)

app.listen(8081, () => {
    console.log('Servidor rodando na porta 8081!')
})