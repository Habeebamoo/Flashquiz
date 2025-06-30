import React, { useState } from "react"

const Page = () => {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [status, setStatus] = useState<"success" | "error" | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (email === "") {
      setStatus("error")
      setMessage("Email is empty")
    }

    try {
      const res = await fetch("https://flashquiz-backend.onrender.com/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email
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
        setMessage("Something went wrong.")  
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex-center bg-accentXlight dark:bg-[#111] h-[100vh]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#333] px-4 py-8 border-1 border-accentCold dark:border-[#444] rounded-md w-[90%] sm:w-[400px] rounded-md">
        <h1 className="font-inter text-xl text-center">Forgot Password</h1>
        <p className="text-sm text-secondary text-center mb-4">Input your email address to proceed to your account revovery</p>
        <div className="mb-1">
            <label htmlFor="email" className="font-inter dark:text-white">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              className="input dark:border-[#555] dark:bg-white" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message &&
            <div className={status === "success" ? "success" : "error"}>
              {message}
            </div>
          }
          <div className="mt-1">
            <button disabled={loading} className="w-full mt-1 btn-black disabled:cursor-not-allowed disabled:opacity-40">{loading ? "---" : "Submit"}</button>
          </div>
      </form>
    </section>
  )
}

export default Page