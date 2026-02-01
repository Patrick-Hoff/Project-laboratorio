import express from 'express'
import { getAtendimentos,
    addAtendimento,
    updateAtendimento,
    deleteAtendimento
 } from '../controllers/atendimentos.js'

const router = express.Router()

// Buscar todos exames
router.get('/', getAtendimentos)

// Criar atendimento
router.post('/add', addAtendimento)

// Atualizar atendimento pelo ID
router.put('/:id/edit', updateAtendimento)

// Deletar atendimento pelo ID
router.delete('/:id/remove', deleteAtendimento)

export default router