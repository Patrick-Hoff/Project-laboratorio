import express from 'express'

import { 
    getAgendamentos,
    agendarConsulta,
    alterarConsulta
} from '../controllers/agendamento.js'

const router = express.Router()


router.get('/', getAgendamentos)

router.post('/', agendarConsulta)

router.put('/:id', alterarConsulta)


export default router