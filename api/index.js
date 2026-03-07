import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { swaggerUi, swaggerDocument } from './config/swagger.js'

// Rotas
import pacientesRoutes from './routes/pacientes.js'
import exames_atendimentoRoutes from './routes/exames_atendimento.js'
import examesRoutes from './routes/exames.js'
import atendimentosRoutes from './routes/atendimentos.js'
import usuariosRoutes from './routes/usuarios.js'
import pagamentosRoutes from './routes/pagamentos.js'
import dashboardRoutes from './routes/dashboard.js'
import agendamentoRoutes from './routes/agendamento.js'
import medicosRoutes from './routes/medico.js'
import convenioRoutes from './routes/convenio.js'
import exameConveniosRoutes from './routes/exame_convenios.js'

dotenv.config()

// Resolver __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middlewares base
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// 🔥 CORS FUNCIONAL COM COOKIES
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// 🔥 Preflight
app.options('*', cors())

// Health check
app.get('/', (req, res) => {
    res.send('API online')
})

// Rotas
app.use('/pacientes', pacientesRoutes)
app.use('/exames_atendimento', exames_atendimentoRoutes)
app.use('/exames', examesRoutes)
app.use('/atendimentos', atendimentosRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/pagamentos', pagamentosRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/agendamento', agendamentoRoutes)
app.use('/medicos', medicosRoutes)
app.use('/convenio', convenioRoutes)
app.use('/exame_convenios', exameConveniosRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Start
app.listen(8081, () => {
    console.log('Servidor rodando na porta 8081!')
})

app.get('/cors-test', (req, res) => {
    res.json({ ok: true })
})
