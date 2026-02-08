import { Routes, Route } from 'react-router-dom'

import Atendimento from '../pages/Atendimento/Atendimento'
import Home from '../pages/Home/Home'
import Pacientes from '../pages/Paciente/Pacientes'
import Exames from '../pages/Exames/Exames'
import Logs from '../pages/Log/Logs'
import Login from '../pages/Login/Login'
import Usuarios from '../pages/Usuarios/Usuarios'
import MyUser from '../pages/myUser/myUser';
import Dashboard from '../pages/Dashboard/Dashboard'
import Agendar_consulta from '../pages/Agendar_consulta/Agendar_consulta'
import Consultas from '../pages/Consultas/Consultas'
import ProtectedRoute from './ProtectedRoute'
import AtendimentoFinanceiro from '../pages/AtendimentoFinanceiro/AtendimentoFinanceiro'
import Medico from '../pages/Medico/Medico'


function RoutesApp() {
    return (
        <Routes>
            <Route path='/' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path='/atendimentos' element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
            <Route path='/atendimento/:id' element={<ProtectedRoute> <Atendimento /> </ProtectedRoute>} />
            <Route path='/atendimento' element={<ProtectedRoute><Atendimento /></ProtectedRoute>} />
            <Route path='/pacientes' element={<ProtectedRoute><Pacientes /></ProtectedRoute>} />
            <Route path='/exames' element={<ProtectedRoute><Exames /></ProtectedRoute>} />
            <Route path='/Agenda' element={<ProtectedRoute><Agendar_consulta /></ProtectedRoute>} />
            <Route path='/Agenda/:id' element={<ProtectedRoute><Agendar_consulta /></ProtectedRoute>} />
            <Route path='/consultas' element={<ProtectedRoute><Consultas /></ProtectedRoute>} />
            <Route path='/login' element={<Login />} />
            <Route path='/meu-usuario' element={<ProtectedRoute><MyUser /></ProtectedRoute>} />
            <Route path='/search-logs/:page' element={<ProtectedRoute isAdmin='S'><Logs /></ProtectedRoute>} />
            <Route path='/Users' element={<ProtectedRoute isAdmin='S'><Usuarios /></ProtectedRoute>} />
            <Route path='/Financeiro/:id' element={<ProtectedRoute isAdmin='S'><AtendimentoFinanceiro /></ProtectedRoute>} />
            <Route path='/Medico' element={<ProtectedRoute><Medico /></ProtectedRoute>} />
        </Routes>
    )
}

export default RoutesApp