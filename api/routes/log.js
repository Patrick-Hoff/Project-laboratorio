import express from 'express'
import { verifyToken } from '../middlewares/auth.js'
import { logsGrid } from '../controllers/log.js'

const router = express.Router();

router.get('/:page', verifyToken, logsGrid)

export default router