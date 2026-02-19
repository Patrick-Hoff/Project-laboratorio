import express from 'express'
import {
    postExameConvenios,
    updateExameConvenio,
    deleteExameConvenio
} from '../controllers/exames_convenio.js'

const router = express.Router()

router.post('/', postExameConvenios)
router.put('/:id', updateExameConvenio)
router.delete('/:id', deleteExameConvenio)

export default router