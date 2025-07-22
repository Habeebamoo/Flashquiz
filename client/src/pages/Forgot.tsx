import React, { useState } from "react"
import { ClipLoader } from "react-spinners"
import { CiMail } from "react-icons/ci"

const Page = () => {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [status, setStatus] = useState<"success" | "error" | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    setMessage("")

    if (email === "") {
      setStatus("error")
      setMessage("Email is empty")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://flashquiz-backend.onrender.com/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
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
    <section className="flex-center bg-accentXlight h-[100vh]">
      <form onSubmit={handleSubmit} className="bg-white px-6 py-10 border-1 border-accentCold rounded-md w-[90%] sm:w-[400px] rounded-md">
        <h1 className="font-inter text-2xl text-center">Forgot Password</h1>
        <p className="text-sm text-secondary text-center mb-6 mt-1">Input your email address to proceed to your account revovery</p>
        <div className=" mt-1 mb-3">
          <label htmlFor="email" className="font-inter">Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              className="pl-11 input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CiMail size={30} color="rgb(177, 170, 170)" className="absolute top-[18px] left-[10px]" />
          </div>
        </div>
        {message &&
          <div className={status === "success" ? "success" : "error"}>
            {message}
          </div>
        }
        <div className="mt-3">
          <button disabled={loading} className="w-full mt-1 py-3 btn-black disabled:cursor-not-allowed disabled:opacity-40 flex-center">{loading ? <ClipLoader size={22} color="#fff" /> : "Submit"}</button>
        </div>
      </form>
    </section>
  )
}

export default Page
