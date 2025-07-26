import express from 'express'
import { getExamesAtendimento,
    addExameAtendimento,
    updateExameAtendimento,
    deleteExameAtendimento
 } from '../controllers/exames_atendimento.js'

const router = express.Router()

// Buscar todos exames de atendimento
router.get('/:id', getExamesAtendimento)

// Criar atendimento
router.post('/add',addExameAtendimento)

// Atualizar atendimento pelo ID
router.put('/:id', updateExameAtendimento)

// Deletar atendimento pelo ID
router.delete('/:id', deleteExameAtendimento)


export default router