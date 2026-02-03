import express from 'express'

import {
    realizar_pagamento,
    info_pagamentos,
    atualizar_pagamento,
    delete_pagamento
} from '../controllers/pagamentos.js'

const router = express.Router()

router.post('/realizar_pagamento/atendimentoid=?/:id', realizar_pagamento)
router.get('/info_pagamentos/:id', info_pagamentos)
router.put('/atualizar_pagamento/:id', atualizar_pagamento)
router.delete('/deletar_pagamento/:id', delete_pagamento)

export default router