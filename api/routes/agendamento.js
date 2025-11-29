import express from 'express'

import { 
    getAgendamentos,
    agendarConsulta
} from '../controllers/agendamento.js'

const router = express.Router()


router.get('/', getAgendamentos)

router.post('/', agendarConsulta)


export default router