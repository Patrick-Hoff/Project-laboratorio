import express from 'express'
import { 
    createConvenio,
    updateConvenio
} from '../controllers/convenio.js'

const router = express.Router()

router.post('/', createConvenio)
router.put('/:id', updateConvenio)

export default router