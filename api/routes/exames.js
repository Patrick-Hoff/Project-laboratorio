import express from 'express'
import { verifyToken } from '../middlewares/auth.js'
import {
    getExames,
    addExame,
    updateExame,
    deleteExame,
    logExames
} from '../controllers/exames.js'

const router = express.Router()

router.get('/', getExames)

router.post('/', verifyToken, addExame)

router.put('/:id/edit', verifyToken, updateExame)

router.delete('/:id/remove', verifyToken, deleteExame)

router.get('/log', logExames)


export default router