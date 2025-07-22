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

export const getNextRankTo = (rank: string) => {
  const ranks: Record<string, Record<string, string>> = {
    "Noob": { "next": "Beginner" },
    "Beginner": { "next": "Learner" },
    "Learner": { "next": "Thinker" },
    "Thinker": { "next": "Scholar" },
    "Scholar": {"next": "Expert" },
    "Expert": { "next": "Master" },
    "Master": { "next": "Grand Master" },
    "Grand Master": { "next": "Legend" },
    "Legend": { "next": "Grand Legend" },
    "Grand Legend": { "next": "Emperal" },
    "Emperal": { "next": "Emperal" }
  }

  return ranks[rank]
}

export const getLevelProgress = (rank: string) => {
  const levels: Record<string, Record<string, number>> = {
    "Noob": { "prev": 0, "next": 0, "level": 0, "nextLevel": 1 },
    "Beginner": { "prev": 100, "next": 200, "level": 1, "nextLevel": 2 },
    "Learner": { "prev": 200, "next": 400, "level": 2, "nextLevel": 3 },
    "Thinker": { "prev": 400, "next": 700, "level": 3, "nextLevel": 4 },
    "Scholar": { "prev": 700, "next": 1100, "level": 4, "nextLevel": 5 },
    "Expert": { "prev": 1100, "next": 1600, "level": 5, "nextLevel": 6 },
    "Master": { "prev": 1600, "next": 2200, "level": 6, "nextLevel": 7 },
    "Grand Master": { "prev": 2200, "next": 3000, "level": 7, "nextLevel": 8 },
    "Legend": { "prev": 3000, "next": 4000, "level": 8, "nextLevel": 9 },
    "Grand Legend": { "prev": 4000, "next": 5000, "level": 9, "nextLevel": 10 },
    "Emperal": { "prev": 5000, "next": 5000, "level": 10, "nextLevel": 10 }
  }

  return levels[rank]
}