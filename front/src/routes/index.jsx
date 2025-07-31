import {Routes, Route} from 'react-router-dom'

import Atendimento from '../pages/Atendimento/Atendimento'
import Home from '../pages/Home/Home'
import Pacientes from '../pages/Paciente/Pacientes'
import Exames from '../pages/Exames/Exames'
import Logs from '../pages/Log/Logs'


function RoutesApp() {
    return (
        <Routes>
            <Route path='/' element={ <Home /> } />
            <Route path='/atendimento/:id' element={ <Atendimento /> } />
            <Route path='/atendimento' element={ <Atendimento />} />
            <Route path='/pacientes' element={ <Pacientes /> } />
            <Route path='/exames' element={ <Exames /> } />
            <Route path='/search-logs/:page' element={ <Logs />} />
        </Routes>
    )
}

export default RoutesApp