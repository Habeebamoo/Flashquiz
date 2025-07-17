import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface User {
  userId: string,
  name: string,
  email: string,
  isVerified: boolean
}

type initUserContext = {
  user: User,
  loading: boolean
}

const UserContext = createContext<initUserContext | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem("flashquiz-web-token")!)

      try {
        const res = await fetch("https://flashquiz-backend.onrender.com/api/user/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
          }
        })

        const response = await res.json()

        if (!res.ok) {
          localStorage.removeItem("flashquiz-web-token")
        } else {
          setUser(response.data)
        }

      } catch (err) {
        console.log(err)
        localStorage.removeItem("flashquiz-web-token")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("must be used in a user provider")

  return context
}
