import express from 'express'
import { getPacientes,
    addPacientes,
    updatePaciente,
    deletePaciente,
    logPaciente
 } from '../controllers/pacientes.js'

const router = express.Router()

// Buscar todos pacientes
router.get('/', getPacientes)

// Cadastrar paciente
router.post('/', addPacientes)

// Atualizar paciente pelo ID
router.put('/:id/edit', updatePaciente)

// Deletar atendimento pelo ID
router.delete('/:id/remove', deletePaciente)

// Buscar todos os logs de pacientes
router.get('/log', logPaciente)

export default router