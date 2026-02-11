import { Link } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { FaUserCircle, FaFileAlt, FaUser, FaRegCalendarAlt, FaUserMd } from "react-icons/fa";
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
  const [isAdmin, setIsAdmin] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8081/usuarios/me', { withCredentials: true })
      .then((res) => setIsAdmin(res.data.isAdmin))
      .catch((err) => console.log(err))
  }, [])

  const toggleMenu = (type) => {
    if (type === 'setting') setMenuOpen(prev => !prev)
    if (type === 'routine') setMenuRotina(prev => !prev)
  }

  return (
    <header className="header">
      <nav className="nav">
        <div className='nav-left'>

          {/* ESQUERDA */}
          <ul className="nav-left">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/agenda">Agendar</Link></li>
            <li><Link to="/consultas">Consultas</Link></li>
          </ul>

          {/* CENTRO - ROTINAS */}
          <ul className="nav-center">
            <li className="containerLink">
              <FaRegCalendarAlt
                className="icon icon-setting"
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
          </ul>
        </div>

        {/* DIREITA */}
        <ul className="nav-right">
          <li className="containerLink">
            <CiSettings
              className="icon icon-setting"
              onClick={() => toggleMenu('setting')}
            />

            {menuOpen && (
              <div className="linkSearch">
                <li>
                  <FaUser className="iconLink" />
                  <Link to="/meu-usuario">Usuário</Link>
                </li>

                {isAdmin === 'S' && (
                  <li>
                    <FaUserCircle className="iconLink" />
                    <Link to="/Users">Criar usuário</Link>
                  </li>
                )}

                {isAdmin === 'S' && (
                  <li>
                    <FaFileAlt className="iconLink" />
                    <Link to="/search-logs/pacientes">Log Pacientes</Link>
                  </li>
                )}

                {isAdmin === 'S' && (
                  <li>
                    <FaFileAlt className="iconLink" />
                    <Link to="/search-logs/exames">Log Exames</Link>
                  </li>
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
