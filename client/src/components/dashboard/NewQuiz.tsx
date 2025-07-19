import React, { useState } from "react"
import { ClipLoader } from "react-spinners"
import { clearLocalStorage } from "../../utils/utils"

const NewQuiz = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<boolean>(false)
  const [form, setForm] = useState({
    category: "Science",
    time: 30,
    difficulty: "easy",
    amount: 10,
    type: "multiple"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearLocalStorage()
    setLoading(true)
    setErrorMessage(false)
    const token = JSON.parse(localStorage.getItem("flashquiz-web-token")!)

    try {
      const res = await fetch("https://flashquiz-backend.onrender.com/api/quiz", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({
          category: form.category,
          amount: form.amount,
          difficulty: form.difficulty,
          type: form.type
        })
      })
      const response = await res.json()

      if (res.ok) {
        localStorage.setItem("flashquiz-quizzes", JSON.stringify(response.results))
        localStorage.setItem("flashquiz-quiz-time", JSON.stringify(form.time))
        localStorage.setItem("flashquiz-quiz-amount", JSON.stringify(form.amount))
        localStorage.setItem("flashquiz-quiz-category", JSON.stringify(form.category))
        setTimeout(() => {
          window.location.href = "/quiz"
        }, 1000)
      } else {
        setErrorMessage(true)
      }
    } catch (err) {
      setErrorMessage(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section className="flex-center bg-accentXlight dark:bg-[#222] h-[100vh]">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#333] p-3 border-1 border-accentCold dark:border-[#444] rounded-md w-[90%] sm:w-[400px] rounded-md">
          <h1 className="text-center font-inter dark:text-white text-lg py-3">Select your Preference</h1>
          <div className="p-2">
            <label htmlFor="category" className="font-inter dark:text-white">Category</label>
            <select
              name="category"
              id="category"
              className="input dark:border-[#555] dark:bg-white"
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="Science">Science</option>
              <option value="Arts">Arts & Entertainment</option>
              <option value="Anime">Anime & Manga</option>
              <option value="Computers">Tech & Computers</option>
              <option value="History">History</option>
              <option value="Mythology">Mythology</option>
              <option value="Politics">Politics</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div className="p-2">
            <label htmlFor="time" className="font-inter dark:text-white">Time</label>
            <select
              name="time"
              id="time"
              className="input dark:border-[#555] dark:bg-white"
              value={form.time}
              onChange={(e) => setForm(prev => ({ ...prev, time: Number(e.target.value) }))}
              required
            >
              <option value="30">30 Sec</option>
              <option value="60">1 Minutes</option>
              <option value="120">2 Minutes</option>
              <option value="300">5 Minutes</option>
              <option value="600">10 Minutes</option>
              <option value="1800">30 Minutes</option>
            </select>
          </div>
          <div className="p-2">
            <label htmlFor="difficulty" className="font-inter dark:text-white">Difficulty</label>
            <select
              name="difficulty"
              id="difficulty"
              className="input dark:border-[#555] dark:bg-white"
              value={form.difficulty}
              onChange={(e) => setForm(prev => ({ ...prev, difficulty: e.target.value }))}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="p-2">
            <label htmlFor="amount" className="font-inter dark:text-white">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="input dark:border-[#555] dark:bg-white"
              min={10}
              max={50}
              value={form.amount}
              onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
              required
            />
          </div>
          <div className="p-2">
            <label htmlFor="type" className="font-inter dark:text-white">Option Type</label>
            <select
              name="type"
              id="type"
              value={form.type}
              className="input dark:border-[#555] dark:bg-white"
              onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
              required
            >
              <option value="boolean">True or False</option>
              <option value="multiple">4 Options</option>
            </select>
          </div>
          {errorMessage && <p className="my-2 text-red-500 font-open text-center">Something went wrong</p>}
          <div className="p-2">
            <button disabled={loading} className="w-full mt-1 py-3 btn-black disabled:cursor-not-allowed disabled:opacity-40 flex-center">{loading ? <ClipLoader size={22} color="#fff" /> : "Start Quiz"}</button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default NewQuiz
