import express from 'express'

import {
    realizar_pagamento,
    info_pagamentos
} from '../controllers/pagamentos.js'

const router = express.Router()

router.post('/realizar_pagamento/atendimentoid=?/:id', realizar_pagamento)
router.get('/info_pagamentos/:id', info_pagamentos)

export default router