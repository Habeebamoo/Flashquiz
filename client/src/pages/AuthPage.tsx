import React, { useState } from "react"
import Header from "../components/Header"
import { useNavigate } from "react-router-dom"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [authenticating, setAuthenticating] = useState<boolean>(false)
  const [status, setStatus] = useState<"error" | "success" | "">("")
  const [message, setMessage] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })
  const navigate = useNavigate()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthenticating(true)
    setMessage("")
    setStatus("")

    try {
      if(isLogin) {
        const res = await fetch("https://flashquiz-backend.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          })
        })

        const response = await res.json()

        if (!res.ok) {
          setStatus("error")
          setMessage(response.error)
        } else {
          setStatus("success")
          setMessage(response.message)
          localStorage.setItem("flashquiz-web-token", JSON.stringify(response.token))
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1500)
        }

      } else {
        if ((form.password).length < 8) {
          setStatus("error")
          setMessage("Password must be 8 characters or more")
          setAuthenticating(false)
          return
        }
        
        const res = await fetch("https://flashquiz-backend.onrender.com/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          })
        })

        const response = await res.json()

        if (!res.ok) {
          setStatus("error")
          setMessage(response.error)
        } else {
          setStatus("success")
          setMessage(response.message)
        }
      }
    } catch (err: any) {
        setStatus("error")
        if (!err.response) {
          setMessage("No Internet Connection")
        } else {
          setMessage("Something went wrong.")  
        }
    } finally {
      setAuthenticating(false)
    }
  }

  const handleAuthType = () => {
    setStatus("")
    setMessage("")
    setIsLogin(!isLogin)
  }

  const loginText = authenticating ? "Logging in..." : "Login"
  const registerText = authenticating ? "Signing Up..." : "Sign Up"

  return (
    <main className="bg-accentXlight h-[100vh]">
      <Header button={false} />
      <section className="h-[100vh] flex-center">
        <form onSubmit={handleAuth} className="bg-white border-1 border-accentCold px-4 py-10 rounded-md w-[90%] sm:w-[400px] mx-auto">
          <h1 className="font-inter text-xl text-center">{isLogin ? "Welcome Back" : "Create Your Free Account"}</h1>
          <p className="text-sm text-secondary text-center mb-4">
            {isLogin ? "Sign in back to your account to continue" : "Sign up for a free account today"}
          </p>
          {!isLogin && <div className="mb-3">
            <label htmlFor="name" className="font-inter">Name</label>
            <input 
              type="text" 
              id="name" 
              className="p-2 border-1 border-accent rounded-md block w-full mt-2" 
              value={form.name}
              onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
              required 
            />
          </div>}
          <div className="mb-3">
            <label htmlFor="email" className="font-inter">Email</label>
            <input 
              type="email" 
              id="email" 
              className="p-2 border-1 border-accent rounded-md block w-full mt-2" 
              value={form.email}
              onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="font-inter">Password</label>
            <input 
              type="password" 
              id="password" 
              className="p-2 border-1 border-accent rounded-md block w-full mt-2" 
              value={form.password}
              onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
              required 
            />
          </div>
          {isLogin && <p onClick={() => navigate("/forgot")} className="text-sm my-2 cursor-pointer text-blue-500">Forgot Password?</p>}
          {message &&
            <div className={status === "success" ? "success" : "error"}>
              {message}
            </div>
          }
          <button 
            type="submit"
            className="btn-black mt-2 max-sm:w-full disabled:cursor-not-allowed disabled:opacity-40" 
            disabled={authenticating}
            >
              {isLogin ? loginText : registerText}
          </button>

          <p className="text-sm text-secondary text-center mt-4">
            {isLogin ? "Need an account?" : "Already have an account?"}
            <span onClick={handleAuthType} className="ml-1 text-blue-500 cursor-pointer font-inter">{isLogin ? "Sign Up" : "Login"}</span>
          </p>
        </form>
      </section>
    </main>
  )
}

export default AuthPage