import express from 'express'
import { verifyToken } from '../middlewares/auth.js'
import { getPacientes,
    addPacientes,
    updatePaciente,
    deletePaciente
 } from '../controllers/pacientes.js'

const router = express.Router()

// Buscar todos pacientes
router.get('/', getPacientes)

// Cadastrar paciente
router.post('/', verifyToken, addPacientes)

// Atualizar paciente pelo ID
router.put('/:id/edit', verifyToken, updatePaciente)

// Deletar atendimento pelo ID
router.delete('/:id/remove', verifyToken, deletePaciente)

export default router