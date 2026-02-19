import express from 'express'
import {
    postExameConvenios
} from '../controllers/exames_convenio.js'

const router = express.Router()

router.post('/', postExameConvenios)

export default router