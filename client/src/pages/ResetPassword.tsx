import React, { useState } from "react"
import { ClipLoader } from "react-spinners"
import { useSearchParams } from "react-router-dom"
import { CiLock } from "react-icons/ci"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const Page = () => {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState<string>("")
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
      const res = await fetch(`https://flashquiz-backend.onrender.com/api/user/password/reset?token=${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
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

  const icon = showPassword ?
    <FaRegEyeSlash
      size={20}
      color="rgb(177, 170, 170)"

    /> :
    <FaRegEye
      size={20}
      color="rgb(177, 170, 170)"
    />

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <section className="flex-center bg-accentXlight h-[100vh]">
      <form onSubmit={handleSubmit} className="bg-white px-6 py-10 border-1 border-accentCold rounded-md w-[90%] sm:w-[400px] rounded-md">
        <h1 className="font-inter text-2xl text-center">Reset Password</h1>
        <p className="text-sm text-secondary text-center mb-6 mt-1">Enter a new password in order to reset your account password</p>
        <div className=" mt-1 mb-3">
          <label htmlFor="password" className="font-inter">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="pl-11 input"
              required
            />
            <CiLock size={30} color="rgb(177, 170, 170)" className="absolute top-[18px] left-[9px]" />
            <div className="cursor-pointer absolute top-[23px] right-[11px]" onClick={togglePassword}>{icon}</div>
          </div>
        </div>
        <div className=" mt-1 mb-3">
          <label htmlFor="c_password" className="font-inter">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="c_password"
              id="c_password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="pl-11 input"
              required
            />
            <CiLock size={30} color="rgb(177, 170, 170)" className="absolute top-[18px] left-[9px]" />
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
        <p onClick={() => window.location.href = "/login"} className="text-sm cursor-pointer text-blue-500 font-inter text-center mt-4">
          Back to Login
          </p>
      </form>
    </section>
  )
}

export default Page
