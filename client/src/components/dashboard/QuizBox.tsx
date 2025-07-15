import { decodeHtml, shuffle } from "../../utils/format"

interface PropsType {
  currentQuiz: any,
  currentIndex: number
}

const QuizBox = ({ currentQuiz, currentIndex }: PropsType) => {
  const initOptions = [...currentQuiz.incorrect_answers]
  initOptions.push(currentQuiz.correct_answer)

  const options = shuffle(initOptions)

  const clickOption = () => {

  }

  return (
    <>
      <h2 className="font-open text-lg dark:text-white mt-5">{currentIndex + 1}. {decodeHtml(currentQuiz.question)}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 my-8">
        {options.map((option: any) => {
          return <button className="p-3 mb-1 btn-black">{decodeHtml(option)}</button>
        })}
      </div>
    </>
  )
}

export default QuizBox