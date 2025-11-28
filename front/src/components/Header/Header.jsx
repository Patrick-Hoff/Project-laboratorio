import { Link } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { FaUserCircle, FaFileAlt, FaUser, FaRegCalendarAlt } from "react-icons/fa";
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
      .then((res) => {
        setIsAdmin(res.data.isAdmin)
      }).catch((err) => {
        console.log(err)
      })
  }, [])

  const toggleMenu = (e) => {
    if (e === 'setting') {
      setMenuOpen(prev => !prev)
    } else if (e === 'routine') {
      setMenuRotina(prev => !prev)
    }
  }


  return (
    <header className="header">
      <nav>
        <ul className='navbarLink'>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/agenda">Agendar</Link></li>
          <div className='containerLink linkRoutine'>
            <FaRegCalendarAlt className='icon icon-setting' onClick={() => toggleMenu('routine')} />
            {menuRotina && (
              <div className='linkSearch routine'>
                <li><Link to="/atendimentos">Atendimentos</Link></li>
                <li><Link to="/atendimento">Novo Atendimento</Link></li>
                <li><Link to="/pacientes">Pacientes</Link></li>
                <li><Link to="/exames">Exames</Link></li>
              </div>
            )}
          </div>

        </ul>

        <ul className='navbarLink'>
          <div className='containerLink'>
            <CiSettings className='icon icon-setting' onClick={() => toggleMenu('setting')} />
            {menuOpen && (
              <div className='linkSearch'>
                <li>
                  <FaUser className='iconLink' /> <Link to="/meu-usuario">Usuario</Link>
                </li>
                {isAdmin === 'S' && (
                  <li><FaUserCircle className='iconLink' /><Link to="/Users">Criar usuario</Link></li>
                )}
                {isAdmin === 'S' && (
                  <li className='containerLinkLog'><FaFileAlt className='iconLink' />
                    <Link to="/search-logs/pacientes">Log Pacientes</Link></li>
                )}
                {isAdmin === 'S' && (
                  <li><FaFileAlt className='iconLink' />
                    <Link to="/search-logs/exames">Log Exames</Link></li>
                )}
                <li className='icon icon-logout'><IoIosLogOut onClick={logoutSistem} /></li>
              </div>
            )}
          </div>
        </ul>
      </nav>
    </header>
  )
}

export default Header