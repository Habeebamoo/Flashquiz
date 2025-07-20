import { useUser } from "../context/UserContext"

export const capitalize = (text: string) => {
  const words = text.split("")
  words[0] = words[0].toUpperCase() 
  return words.join("")
}

export const decodeHtml = (text: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

export const shuffle = (array : string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

export const clearLocalStorage = () => {
  localStorage.removeItem("flashquiz-quizzes")
  localStorage.removeItem("flashquiz-option-attempts")
  localStorage.removeItem("flashquiz-quiz-time")
  localStorage.removeItem("flashquiz-quiz-index")
  localStorage.removeItem("flashquiz-quiz-score")
  localStorage.removeItem("flashquiz-quiz-amount")
  localStorage.removeItem("flashquiz-quiz-category")
  localStorage.removeItem("flashquiz-quiz-hasuploaded")
}

export const uploadQuiz = async () => {
  const { user } = useUser()
  const uploaded = JSON.parse(localStorage.getItem("flashquiz-quiz-hasuploaded")!)
  const token = JSON.parse(localStorage.getItem("flashquiz-web-token")!)
  const category = JSON.parse(localStorage.getItem("flashquiz-quiz-category")!)
  const correctAnswers = JSON.parse(localStorage.getItem("flashquiz-quiz-score")!)
  const amountOfQuizzes = JSON.parse(localStorage.getItem("flashquiz-quiz-amount")!)
  const score = (correctAnswers / amountOfQuizzes) * 100

  if (uploaded) {
    return
  }

  const res = await fetch("https://flashquiz-backend.onrender.com/api/quiz/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-API-KEY": import.meta.env.VITE_X_API_KEY,
    }, 
    body: JSON.stringify({
      user_id: user.userId,
      category: category,
      score: Math.round(score),
      points: Math.round(score / 1.8)
    })
  })

  const response = await res.json()
  localStorage.setItem("flashquiz-quiz-hasuploaded", JSON.stringify("hasuploaded"))

  if (!res.ok) {
    console.log(response.error)
  }
}