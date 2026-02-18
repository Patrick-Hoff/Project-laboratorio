import express from 'express'
import { 
    createConvenio,
    updateConvenio,
    deleteConvenio
} from '../controllers/convenio.js'

const router = express.Router()

router.post('/', createConvenio)
router.put('/:id', updateConvenio)
router.delete('/:id', deleteConvenio)

export default router