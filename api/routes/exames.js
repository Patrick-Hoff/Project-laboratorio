import express from 'express'
import { getExames,
    addExame,
    updateExame,
    deleteExame
 } from '../controllers/exames.js'

const router = express.Router()

// Buscar todos exames
router.get('/', getExames)

// Criar atendimento
router.post('/',addExame)

// Atualizar atendimento pelo ID
router.put('/:id/edit', updateExame)

// Deletar atendimento pelo ID
router.delete('/:id/remove', deleteExame)


export default router