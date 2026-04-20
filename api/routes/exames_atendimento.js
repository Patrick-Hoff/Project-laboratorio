import express from 'express'
import { getExamesAtendimento,
    addExameAtendimento,
    updateStatusLote,
    deleteExameAtendimento
 } from '../controllers/exames_atendimento.js'

const router = express.Router()

// Buscar todos exames de atendimento
router.get('/', getExamesAtendimento)

// Criar atendimento
router.post('/add',addExameAtendimento)

// Atualizar atendimento pelo ID
router.put('/status_lote', updateStatusLote)

// Deletar atendimento pelo ID
router.delete('/:id/atendimento/:att', deleteExameAtendimento)


export default router