import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"

const Page = () => {
  const [ searchParams ] = useSearchParams()
  const [message, setMessage] = useState<string>("")
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [loading, setLoading] = useState<boolean>(false)
  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  })
  const token: string | null = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setStatus("")
    setLoading(true)
    if (form.password !== form.confirmPassword) {
      setMessage("Password does not match")
      setStatus("error")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`https://flashquiz-backend.onrender.com/api/user/reset-password?token=${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
          password: form.password
        })
      })

      const response = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(response.message)
      } else {
        setStatus("error")
        setMessage(response.error)
      }
    } catch (err: any) {
      setStatus("error")
      if (!err.response) {
        setMessage("No Internet Connection")
      } else {
        setMessage("Something Went Wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex-center bg-accentXlight dark:bg-[#111] h-[100vh]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#333] px-4 py-10 border-1 border-accentCold dark:border-[#444] rounded-md w-[90%] sm:w-[400px] rounded-md">
        <h1 className="font-inter text-xl text-center">Reset Password</h1>
        <p className="text-sm text-secondary text-center mb-4">Enter a new password in order to reset your account password</p>
        <div className=" mt-1 mb-3">
            <label htmlFor="password" className="font-inter dark:text-white">New Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              value={form.password}
              onChange={(e) => setForm((prev) => ({...prev, password: e.target.value}))}
              className="input dark:border-[#555] dark:bg-white" 
              required
            />
          </div>
        <div className=" mt-1 mb-3">
            <label htmlFor="c_password" className="font-inter dark:text-white">Confirm Password</label>
            <input 
              type="password" 
              name="c_password" 
              id="c_password" 
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({...prev, confirmPassword: e.target.value}))}
              className="input dark:border-[#555] dark:bg-white" 
              required
            />
          </div>
          {message &&
            <div className={status === "success" ? "success" : "error"}>
              {message}
            </div>
          }
          <div className="mt-3">
            <button disabled={loading} className="w-full mt-1 btn-black disabled:cursor-not-allowed disabled:opacity-40">{loading ? "---" : "Submit"}</button>
          </div>
          <p onClick={() => window.location.href = "/login"} className="text-sm text-blue-500 font-inter text-center mt-4">
            Back to Login
          </p>
      </form>
    </section>
  )
}

export default Page