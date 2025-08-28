import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = ({ children, isAdmin }) => {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:8081/usuarios/me', { withCredentials: true })
      .then((res) => {setIsAuth(res.data)})
      .catch(() => setIsAuth(false))
  }, [])

  if (isAuth === null) {
    return <div>Carregando...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" />
  }

  if(isAdmin && isAuth.isAdmin !== 'S') {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
