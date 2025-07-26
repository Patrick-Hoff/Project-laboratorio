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
        </ul>
      </nav>
    </header>
  )
}

export default Header
