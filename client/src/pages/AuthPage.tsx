import React, { useState } from "react"
import Header from "../components/Header"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { CiLock, CiMail, CiUser } from "react-icons/ci"
import { FaUser } from "react-icons/fa"

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

  const loginText = authenticating ? <ClipLoader size={22} color="#fff" /> : "Login"
  const registerText = authenticating ? <ClipLoader size={22} color="#fff" /> : "Sign Up"

  return (
    <main className="bg-accentXlight h-[100vh]">
      <Header button={false} />
      <section className="h-[100vh] flex-center">
        <form onSubmit={handleAuth} className="bg-white border-1 border-accentCold px-6 py-10 rounded-md w-[90%] sm:w-[400px] mx-auto">
          <h1 className="font-inter text-2xl text-center">{isLogin ? "Welcome Back" : "Create Your Free Account"}</h1>
          <p className="text-sm text-secondary mt-1 text-center mb-10">
            {isLogin ? "Sign in back to your account to continue" : "Sign up for a free account today"}
          </p>
          {!isLogin && <div className="mb-3">
            <label htmlFor="name" className="font-inter">Name</label>
            <div className="relative">
              <input 
                type="text" 
                id="name" 
                className="pr-3 py-3 pl-11 border-1 border-accent rounded-md block w-full mt-2" 
                value={form.name}
                onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                required 
              />
              <CiUser size={30} color="rgb(177, 170, 170)" className="absolute top-[9px] left-[9px]" />
            </div> 
          </div>}
          <div className="mb-3">
            <label htmlFor="email" className="font-inter">Email</label>
            <div className="relative">
              <input 
                type="email" 
                id="email" 
                className="pr-3 py-3 pl-11 border-1 border-accent rounded-md block w-full mt-2" 
                value={form.email}
                onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
                required 
              />
              <CiMail size={30} color="rgb(177, 170, 170)" className="absolute top-[9px] left-[10px]" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="font-inter">Password</label>
            <div className="relative">
              <input 
                type="password" 
                id="password" 
                className="pr-3 py-3 pl-12 border-1 border-accent rounded-md block w-full mt-2" 
                value={form.password}
                onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
                required 
              />
              <CiLock size={30} color="rgb(177, 170, 170)" className="absolute top-[9px] left-[11px]" />
            </div>
          </div>
          {isLogin && <p onClick={() => navigate("/forgot")} className="text-sm my-4 pl-2 cursor-pointer text-blue-500">Forgot Password?</p>}
          {message &&
            <div className={status === "success" ? "success" : "error"}>
              {message}
            </div>
          }
          <button 
            type="submit"
            className=" py-3 btn-black mt-2 max-sm:w-full disabled:cursor-not-allowed disabled:opacity-40 flex-center" 
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
