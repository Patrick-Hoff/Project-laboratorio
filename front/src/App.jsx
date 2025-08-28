import { useLocation } from 'react-router-dom';
import RoutesApp from './routes/index';
import Header from './components/Header/Header';

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      <RoutesApp />
    </>
  );
}

export default App;
