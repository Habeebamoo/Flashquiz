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

export type RankDetails = {
  prev: number,
  next: number,
  level: number
}

export function getLevelProgress(rank: string) {
  let levels: Record<string, Record<string, number>> = {
    "Noob": { "prev": 0, "next": 0, "level": 0 },
    "Beginner": { "prev": 100, "next": 200, "level": 1 },
    "Learner": { "prev": 200, "next": 400, "level": 2 },
    "Thinker": { "prev": 400, "next": 700, "level": 3 },
    "Scholar": { "prev": 700, "next": 1100, "level": 4 },
    "Expert": { "prev": 1100, "next": 1600, "level": 5 },
    "Master": { "prev": 1600, "next": 2200, "level": 6 },
    "Grand Master": { "prev": 2200, "next": 3000, "level": 7 },
    "Legend": { "prev": 3000, "next": 4000, "level": 8 },
    "Grand Legend": { "prev": 4000, "next": 5000, "level": 9 },
    "Emperal": { "prev": 5000, "next": 5000, "level": 10 }
  }

  return levels[rank]
}