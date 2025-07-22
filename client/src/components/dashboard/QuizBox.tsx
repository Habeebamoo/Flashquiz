import { decodeHtml } from "../../utils/utils"
import { OptionsAttempts } from "./QuizSection"

interface PropsType {
  options: string[],
  currentQuiz: any,
  showOptions: boolean,
  close: () => void,
  currentIndex: number,
  setOptionAttempt: React.Dispatch<React.SetStateAction<OptionsAttempts[]>>,
  setScore: React.Dispatch<React.SetStateAction<number>>
}

const QuizBox = ({ options, currentQuiz, showOptions, close, currentIndex, setOptionAttempt, setScore }: PropsType) => {
  const clickOption = (option: string) => {
    setOptionAttempt(prev => [...prev, { question: currentQuiz.question, yourAnswer: option, correctAnswer: currentQuiz.correct_answer }])
    if (option === currentQuiz.correct_answer) {
      setScore(prev => prev + 1)
    }
    close()
  }

  return (
    <>
      <h2 className="font-open text-lg dark:text-white mt-5">{currentIndex + 1}. {decodeHtml(currentQuiz.question)}</h2>
      {showOptions && <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 my-8">
        {options.map((option: any) => {
          return <button onClick={() => clickOption(option)} className="p-3 mb-1 btn-black">{decodeHtml(option)}</button>
        })}
      </div>
      }
    </>
  )
}

export default QuizBox