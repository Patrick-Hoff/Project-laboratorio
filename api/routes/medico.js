import express from 'express'
import { 
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
} from '../controllers/medicos.js'


const router = express.Router()

router.get('/', getMedicos)
router.post('/', createMedico)
router.put('/:id', updateMedico)
router.delete('/:id', deleteMedico)


export default router