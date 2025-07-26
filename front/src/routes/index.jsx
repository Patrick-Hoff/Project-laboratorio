import {Routes, Route} from 'react-router-dom'

import Atendimento from '../pages/Atendimento/Atendimento'
import Home from '../pages/Home/Home'
import Pacientes from '../pages/Paciente/Pacientes'
import Exames from '../pages/Exames/Exames'


function RoutesApp() {
    return (
        <Routes>
            <Route path='/' element={ <Home /> } />
            <Route path='/atendimento/:id' element={ <Atendimento /> } />
            <Route path='/atendimento' element={ <Atendimento />} />
            <Route path='/pacientes' element={ <Pacientes /> } />
            <Route path='/exames' element={ <Exames /> } />
        </Routes>
    )
}

export default RoutesApp