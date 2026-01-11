import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Criar o Contexto
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8081/usuarios/me', { withCredentials: true })
      .then((res) => {
        setUserData(res.data); // Armazena o usuário autenticado
      })
      .catch(() => setUserData(null));
  }, []);

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
};
