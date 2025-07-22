import { useEffect, useState } from "react"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { FaCheckCircle, FaHome, FaSpinner } from "react-icons/fa"
import { MdCancel } from "react-icons/md"
import { CiStar } from "react-icons/ci"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import { decodeHtml } from "../../utils/utils"
import { useUser } from "../../context/UserContext"
import Error from "./Error"

const ResultSection = () => {
  const [attempts] = useState<any[]>(() => {
    const storedArray = localStorage.getItem("flashquiz-option-attempts")!
    return storedArray ? JSON.parse(storedArray) : []
  })
  const [percentage, setPercentage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const { user } = useUser()
  const correctAnswers = JSON.parse(localStorage.getItem("flashquiz-quiz-score")!)
  const amountOfQuizzes = JSON.parse(localStorage.getItem("flashquiz-quiz-amount")!)
  const quizCategory = JSON.parse(localStorage.getItem("flashquiz-quiz-category")!)
  const target = (correctAnswers / amountOfQuizzes) * 100

  const navigate = useNavigate()
  const firstAttempts = attempts.slice(0, 2)

  useEffect(() => {
    const uploaded = JSON.parse(localStorage.getItem("flashquiz-quiz-hasuploaded")!)
    const quizExist = JSON.parse(localStorage.getItem("flashquiz-quizzes")!)
    const token = JSON.parse(localStorage.getItem("flashquiz-web-token")!)
    setLoading(true)
    setError(false)
    if (uploaded) {
      setLoading(false)
      return
    }

    if (!quizExist) {
      setLoading(false)
      return
    }

    const uploadQuiz = async () => {
      try {
        const res = await fetch("https://flashquiz-backend.onrender.com/api/quiz/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
          },
          body: JSON.stringify({
            userId: user.userId,
            score: Math.round(target),
            points: Math.round(target / 1.8)
          })
        })
        const response = await res.json()

        if (!res.ok) {
          console.log(response.error)
          setError(true)
        }
      } catch (err: any) {
        console.log(err.message)
      } finally {
        setLoading(false)
        localStorage.setItem("flashquiz-quiz-hasuploaded", JSON.stringify("hasuploaded"))
      }
    }

    uploadQuiz()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev < target) return prev + 1
        clearInterval(interval)
        return target
      })
    }, 15)
  }, [])

  const toHome = () => {
    window.location.href = "/dashboard"
  }

  const themeText = (): string => {
    if (percentage <= 49) {
      return "tomato"
    } else if (percentage <= 69) {
      return ""
    } else if (percentage <= 89) {
      return "rgb(216, 238, 15)"
    } else {
      return "rgb(37, 207, 22)"
    }
  }

  const comment = (): string => {
    if (percentage <= 49) {
      return "Poor"
    } else if (percentage <= 69) {
      return "Good"
    } else if (percentage <= 89) {
      return "Excellent"
    } else {
      return "Perfect"
    }
  }

  if (error) return <Error to="/dashboard" />

  const pageContent = loading ? (
    <Loading />
  ) : (
    <section className="mt-[80px]">
      <div className="text-center mt-[50px] mb-5">
        <h1 className="text-3xl font-inter dark:text-white">Quiz Result</h1>
        <p className="text-secondary dark:text-white">{quizCategory}</p>        
      </div>
      <div className="">
        <div className="bg-white dark:bg-[#333] rounded-md border-1 border-accentCold dark:border-[#444] p-6 mb-3">
          <div className="flex-center mx-auto h-50 w-50">
            <CircularProgressbar 
              value={percentage} 
              text={`${percentage}%`}
              strokeWidth={10} 
              styles={buildStyles({
                textColor: themeText(),
                pathColor: themeText(),
                trailColor: "#d6d6d6"
              })}
            />
          </div>
          <h1 className="text-2xl text-center dark:text-white font-open mt-6">{comment()}</h1>
          <h2 className="font-inter dark:text-white mt-6 max-sm:text-center">Quiz Statistics</h2>
          <div className="mt-2 flex-between">
            <div>
              <p className="text-secondary text-sm dark:text-white">Correct answers</p>
              <div className="flex-start">
                <FaCheckCircle color="green" />
                <p className="ml-2 font-inter dark:text-white">{correctAnswers}/{amountOfQuizzes}</p>
              </div>
            </div>
            <div>
              <p className="text-secondary text-sm dark:text-white">Incorrect answers</p>
              <div className="flex-start">
                <MdCancel color="red" size={20} />
                <p className="ml-2 font-inter dark:text-white">{amountOfQuizzes - correctAnswers}/{amountOfQuizzes}</p>
              </div>
            </div>
            <div>
              <p className="text-secondary text-sm dark:text-white">Points Earned</p>
              <div className="flex-start">
                <CiStar color="gold" size={25} />
                <p className="ml-2 font-inter dark:text-white">{Math.round(percentage / 1.8)}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:flex-start items-center">
            <button onClick={() => navigate("/new")} className="btn-black max-sm:w-full mt-2 flex-center">
              <FaSpinner className="mr-2" />
              Retry
            </button>
            <button onClick={toHome} className="btn-white sm:ml-2 max-sm:w-full mt-2 flex-center">
              <FaHome className="mr-2" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#333] rounded-md border-1 border-accentCold dark:border-[#444] p-6 mb-3">
          <h1 className="font-inter text-xl dark:text-white">Review Incorrect Answers</h1>
          <p className="text-secondary dark:text-white text-sm">Learn from your mistakes and improve next time</p>
          {
            firstAttempts.map(obj => {
              return (
                <>
                  <div className="mt-4">
                    <div className="rounded-md border-1 border-accentCold dark:border-[#555] p-4">
                      <h2 className="font-inter dark:text-white">{decodeHtml(obj.question)}</h2>
                      <div className="flex-start mt-2">
                        {obj.yourAnswer !== obj.correctAnswer ? <MdCancel color="red" size={18} /> : <FaCheckCircle color="green" />}
                        <p className="text-secondary ml-2 dark:text-accentLight">Your answer</p>
                      </div>
                      <p className="font-inter ml-7 dark:text-white">{decodeHtml(obj.yourAnswer)}</p>
                      <div className="flex-start mt-2">
                        <FaCheckCircle color="green" />
                        <p className="text-secondary ml-2 dark:text-accentLight">Correct answer</p>
                      </div>
                      <p className="font-inter ml-7 dark:text-white">{decodeHtml(obj.correctAnswer)}</p>
                    </div>
                  </div>
                </>
              )
            })
          }
          <button onClick={() => navigate("/dashboard/answers")} className="btn-black max-sm:w-full mt-3">View All</button>
        </div>
      </div>
    </section>
  )

  return (
    <>
      {pageContent}
    </>
  )
}

export default ResultSection