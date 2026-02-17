import express from 'express'
import { 
    createConvenio
} from '../controllers/convenio.js'

const router = express.Router()

router.post('/', createConvenio)

export default router