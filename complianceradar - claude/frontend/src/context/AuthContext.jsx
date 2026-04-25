import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('cr_token')
    const savedUser  = localStorage.getItem('cr_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    localStorage.setItem('cr_token', authResponse.token)
    localStorage.setItem('cr_user', JSON.stringify(authResponse))
    setToken(authResponse.token)
    setUser(authResponse)
  }

  const logout = () => {
    localStorage.removeItem('cr_token')
    localStorage.removeItem('cr_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
