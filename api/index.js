import express from 'express'
import cors from 'cors'
import pacientesRoutes from './routes/pacientes.js'
import exames_atendimentoRoutes from './routes/exames_atendimento.js'
import examesRoutes from './routes/exames.js'
import atendimentosRoutes from './routes/atendimentos.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req,res) => {
    res.send('API online')
})

app.use('/pacientes', pacientesRoutes)
app.use('/exames_atendimento', exames_atendimentoRoutes)
app.use('/exames', examesRoutes)
app.use('/atendimentos', atendimentosRoutes)


app.listen(8081, () => {
    console.log('Servidor rodando!')
})