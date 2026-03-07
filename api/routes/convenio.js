import express from 'express'
import { 
    createConvenio,
    updateConvenio,
    deleteConvenio,
    getConvenio
} from '../controllers/convenio.js'

const router = express.Router()

router.get('/', getConvenio)
router.post('/', createConvenio)
router.put('/:id', updateConvenio)
router.delete('/:id', deleteConvenio)

export default router