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