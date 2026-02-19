import express from 'express'
import {
    postExameConvenios,
    updateExameConvenio
} from '../controllers/exames_convenio.js'

const router = express.Router()

router.post('/', postExameConvenios)
router.put('/:id', updateExameConvenio)

export default router