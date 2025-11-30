import express from 'express'

import { 
    getAgendamentos,
    agendarConsulta,
    alterarConsulta,
    deletarDaAgenda
} from '../controllers/agendamento.js'

const router = express.Router()


router.get('/', getAgendamentos)

router.post('/', agendarConsulta)

router.put('/:id', alterarConsulta)

router.delete('/:id', deletarDaAgenda)


export default router