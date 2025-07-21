import { FaDatabase, FaTrophy } from "react-icons/fa"
import { GrScorecard } from "react-icons/gr"
import ProgressBar from "@ramonak/react-progress-bar"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { capitalize, clearLocalStorage, getLevelProgress, } from "../../utils/utils"
import Modal from "./Modal"
import { useState } from "react"
import { GiProgression } from "react-icons/gi"
import { PiCoinsFill } from "react-icons/pi"

const Page = () => {
  const [modal, setModal] = useState<boolean>(false)
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [modalHead, setModalHead] = useState<string>("")
  const [modalBody, setModalBody] = useState<string>("")
  const { user } = useUser()
  const navigate = useNavigate()
  const obj = getLevelProgress(user.rank)
  const percent = ((user.totalPoints - obj.prev) / (obj.next - obj.prev)) * 100

  const startQuiz = () => {
    if (user.isVerified == false) {
      setModal(true)
      setStatus("error")
      setModalHead("Unverified Account")
      setModalBody("Verify your email inorder to attempt quizzess")
      return
    }

    clearLocalStorage()
    navigate("/new")
  }

  return (
    <>
      <section className="p-2 mt-[70px]">
        {modal && <Modal type={status} head={modalHead} body={modalBody} showModal={setModal} />}
        <p className="text-secondary dark:text-white text-2xl mb-5">Welcome back, {capitalize(user.name)}</p>
        <button onClick={startQuiz} className="btn-black dark:btn-white">Start new Quiz</button>
      </section>
      <div className="flex-center bg-white dark:bg-[#333] dark:text-white p-2 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto">Overview</div>
      <section className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 w-[95%] mx-auto">
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444]">
          <div className="flex-between">
            <h2 className="font-inter text-sm text-thinBlack dark:text-accentTheme">Quiz Completed</h2>
            <FaDatabase size={18} color="rgb(177, 170, 170)" />
          </div>
          <p className="text-2xl font-bold mt-1">{user.quizCompleted}</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444]">
          <div className="flex-between">
            <h2 className="font-inter text-sm text-thinBlack dark:text-accentTheme">Average Score</h2>
            <GrScorecard size={18} color="rgb(177, 170, 170)" />
          </div>
          <p className="text-2xl font-bold mt-1">{user.averageScore}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444]">
          <div className="flex-between">
            <h2 className="font-inter text-sm text-thinBlack dark:text-accentTheme">Current Rank</h2>
            <GiProgression size={18} color="rgb(177, 170, 170)" />
          </div>
          <p className="text-2xl font-open font-bold mt-1">{user.rank}</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444]">
          <div className="flex-between">
            <h2 className="font-inter text-sm text-thinBlack dark:text-accentTheme">Total Points</h2>
            <PiCoinsFill size={20} color="rgb(177, 170, 170)" />
          </div>
          <p className="text-2xl font-open font-bold mt-1">{user.totalPoints}</p>
        </div>
      </section>

      <section className="bg-white dark:bg-[#333] dark:text-white p-4 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto">
        <h2 className="font-inter text-lg">Level Progress</h2>
        <p className="text-sm text-secondary dark:text-accentLight">Level {obj.level} - {user.totalPoints} points</p>
        <div className="text-sm flex-between mt-3 mb-2">
          <p>Current: {user.totalPoints}pts</p>
          <p>Next Level: {obj.next}pts</p>
        </div>
        <ProgressBar completed={percent} height="8px" bgColor="#000" isLabelVisible={false} />
        <p className="text-sm text-secondary dark:text-accentLight mt-2">{obj.next - user.totalPoints} points until level {obj.level + 1}</p>
      </section>

      <section className="bg-white dark:bg-[#333] dark:text-white p-4 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto mb-4">
        <FaTrophy className="mx-auto mb-1" size={40} color="rgb(177, 170, 170)" />
        <h2 className="font-inter text-lg text-center mb-2">Leaderboard Coming Soon!</h2>
        <p className="text-sm text-secondary text-center dark:text-accentLight max-sm:w-[80%] mx-auto">
          We're working hard to bring you an exciting leaderboard feature where you can compete with the other platform members and see how you rank globally
        </p>
        <p className="text-sm text-black font-inter mt-4 mb-3 text-center dark:text-accentLight">What to expect.</p>
        <p className="text-sm text-secondary text-center dark:text-accentLight max-sm:w-[80%] mx-auto mb-1">
          Global ranking by points and perfomance
        </p>
        <p className="text-sm text-secondary text-center dark:text-accentLight max-sm:w-[80%] mx-auto mb-1">
          Weekly and monthly leaderboard
        </p>
        <p className="text-sm text-secondary text-center dark:text-accentLight max-sm:w-[80%] mx-auto mb-1">
          Special badges for top performers
        </p>
      </section>
    </>
  )
}

export default Page