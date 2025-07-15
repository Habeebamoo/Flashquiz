import { useEffect, useState } from "react"
import { FaStopwatch } from "react-icons/fa"
import { useTheme } from "../../context/ThemeContext"
import QuizBox from "./QuizBox"

const QuizSection = () => {
  const [initTime] = useState<number>(() => {
    const storedSeconds: string | null = localStorage.getItem("flashquiz-quiz-time")!
    return storedSeconds ? Number(JSON.parse(storedSeconds)) : 30
  }) 
  const [quizArray] = useState<any[]>(() => {
    const storedArray = localStorage.getItem("flashquiz-quizzes")!
    return storedArray ? JSON.parse(storedArray) : []
  })
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const str: string = "flashquiz-quiz-index"
    return localStorage.getItem(str)! ? JSON.parse(localStorage.getItem(str)!) : 0
  })
  const [optionAttempts, setOptionAttempts] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState<number>(initTime)
  const { theme } = useTheme()
  const currentQuiz = quizArray[currentIndex]

  if (timeLeft <= 0) {
    window.location.href = "/dashboard/result";
  }

  useEffect(() => {
    localStorage.setItem("flashquiz-option-attempts", JSON.stringify(optionAttempts))
  }, [optionAttempts])

  useEffect(() => {
    localStorage.setItem("flashquiz-quiz-index", JSON.stringify(currentIndex))
  }, [currentIndex])

  useEffect(() => {
    localStorage.setItem("flashquiz-quiz-time", JSON.stringify(timeLeft))
  }, [timeLeft])

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const iconTheme = theme === "light" ? "black" : "white";

  return (
    <main className="flex-center bg-accentXlight dark:bg-[#111] da h-[100vh]">
      <div className="bg-white dark:bg-[#333] p-5 border-1 border-accentCold dark:border-[#444] rounded-md w-[90%] sm:w-[400px] rounded-lg">
        <div className="flex-end">
          <FaStopwatch color={iconTheme} />
          <p className="text-lg dark:text-white font-open ml-1">{formatTime(timeLeft)}</p>
        </div>
        <QuizBox currentQuiz={currentQuiz} currentIndex={currentIndex} />
        <div className="flex-between w-[90%] mx-auto">
          <p className="text-sm text-secodary dark:text-white">Question {currentIndex + 1} of {quizArray.length}</p>
          <button onClick={handleNext} className="btn-black">
            {currentIndex + 1 == quizArray.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </main>
  )
}

export default QuizSection