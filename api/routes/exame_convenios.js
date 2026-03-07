import express from 'express'
import {
    getExameConvenio,
    postExameConvenio,
    updateExameConvenio,
    deleteExameConvenio
} from '../controllers/exames_convenio.js'

const router = express.Router()

router.get('/', getExameConvenio)
router.post('/', postExameConvenio)
router.put('/:id', updateExameConvenio)
router.delete('/:id', deleteExameConvenio)

export default router