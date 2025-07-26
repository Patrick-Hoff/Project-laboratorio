import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes/index'
import Header from './components/Header/Header'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <RoutesApp />
    </BrowserRouter>
  )
}

export default App