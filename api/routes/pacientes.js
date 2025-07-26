import express from 'express'
import { getPacientes,
    addPacientes,
    updatePaciente,
    deletePaciente
 } from '../controllers/pacientes.js'

const router = express.Router()

// Buscar todos exames
router.get('/', getPacientes)

// Criar atendimento
router.post('/',addPacientes)

// Atualizar atendimento pelo ID
router.put('/:id/edit', updatePaciente)

// Deletar atendimento pelo ID
router.delete('/:id/remove', deletePaciente)

export default router