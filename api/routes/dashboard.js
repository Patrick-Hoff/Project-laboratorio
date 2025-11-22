import express from 'express'
import {
    consultas_hoje
} from '../controllers/dashboard.js'

const router = express.Router()

router.get('/', consultas_hoje)

export default router