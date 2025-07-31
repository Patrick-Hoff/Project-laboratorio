import { Link } from 'react-router-dom'
import './style.css'

function Header() {
  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/atendimento">Novo Atendimento</Link>
          </li>
          <li>
            <Link to="/pacientes">Pacientes</Link>
          </li>
          <li>
            <Link to="/exames">Exames</Link>
          </li>
            <li className='containerLink'>
              <Link >Logs</Link>
              <div className='linkLog'>
                <Link to="/search-logs/pacientes">Pacientes</Link>
                <Link to="/search-logs/exames">Exames</Link>
              </div>
            </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
