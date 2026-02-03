import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = ({ children, isAdmin }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:8081/usuarios/me', {
      withCredentials: true
    })
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
