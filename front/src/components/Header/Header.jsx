import { Link } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { 
  FaUserCircle, 
  FaFileAlt, 
  FaUser, 
  FaRegCalendarAlt, 
  FaUserMd,
  FaMoneyBillWave 
} from "react-icons/fa";
import axios from 'axios'
import { useState, useEffect } from 'react';
import './style.css'

async function logoutSistem() {
  try {
    await axios.post('http://localhost:8081/usuarios/logout', {}, { withCredentials: true })
    window.location.href = '/login'
  } catch (error) {
    console.error('Erro ao fazer logout: ' + error)
  }
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuRotina, setMenuRotina] = useState(false)
  const [menuFinance, setMenuFinance] = useState(false)
  const [isAdmin, setIsAdmin] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8081/usuarios/me', { withCredentials: true })
      .then((res) => setIsAdmin(res.data.isAdmin))
      .catch((err) => console.log(err))
  }, [])

  const toggleMenu = (type) => {
    if (type === 'setting') {
      setMenuOpen(prev => !prev)
      setMenuRotina(false)
      setMenuFinance(false)
    }

    if (type === 'routine') {
      setMenuRotina(prev => !prev)
      setMenuOpen(false)
      setMenuFinance(false)
    }

    if (type === 'finance') {
      setMenuFinance(prev => !prev)
      setMenuOpen(false)
      setMenuRotina(false)
    }
  }

  return (
    <header className="header">
      <nav className="nav">

        {/* ESQUERDA */}
        <ul className="nav-left">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/agenda">Agendar</Link></li>
          <li><Link to="/consultas">Consultas</Link></li>
        </ul>

        {/* CENTRO */}
        <ul className="nav-center">

          {/* ROTINAS */}
          <li className="containerLink">
            <FaRegCalendarAlt
              className="icon"
              onClick={() => toggleMenu('routine')}
            />

            {menuRotina && (
              <div className="linkSearch routine">
                <li><Link to="/atendimentos">Atendimentos</Link></li>
                <li><Link to="/atendimento">Novo Atendimento</Link></li>
                <li><Link to="/pacientes">Pacientes</Link></li>
                <li><Link to="/exames">Exames</Link></li>
                <li>
                  <FaUserMd className="iconLink" />
                  <Link to="/medico">Médicos</Link>
                </li>
              </div>
            )}
          </li>

          {/* FINANCEIRO */}
          <li className="containerLink">
            <FaMoneyBillWave
              className="icon"
              onClick={() => toggleMenu('finance')}
            />

            {menuFinance && (
              <div className="linkSearch finance">
                <li>
                  <Link to="/convenios">Convênios</Link>
                </li>
                <li>
                  <Link to="/valor-exame">Tabela de Preços</Link>
                </li>
              </div>
            )}
          </li>

        </ul>

        {/* DIREITA */}
        <ul className="nav-right">
          <li className="containerLink">
            <CiSettings
              className="icon"
              onClick={() => toggleMenu('setting')}
            />

            {menuOpen && (
              <div className="linkSearch">
                <li>
                  <FaUser className="iconLink" />
                  <Link to="/meu-usuario">Usuário</Link>
                </li>

                {isAdmin === 'S' && (
                  <>
                    <li>
                      <FaUserCircle className="iconLink" />
                      <Link to="/Users">Criar usuário</Link>
                    </li>

                    <li>
                      <FaFileAlt className="iconLink" />
                      <Link to="/search-logs/pacientes">Log Pacientes</Link>
                    </li>

                    <li>
                      <FaFileAlt className="iconLink" />
                      <Link to="/search-logs/exames">Log Exames</Link>
                    </li>
                  </>
                )}

                <li className="logout">
                  <IoIosLogOut onClick={logoutSistem} />
                </li>
              </div>
            )}
          </li>
        </ul>

      </nav>
    </header>
  )
}

export default Header