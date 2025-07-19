import { FaDatabase, FaTrophy } from "react-icons/fa"
import { GrScorecard } from "react-icons/gr"
import { IoIosArrowForward } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { capitalize, clearLocalStorage } from "../../utils/utils"
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
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444] flex-between">
          <div>
            <h2 className="font-inter text-sm text-thinBlack dark:text-white">Quiz Completed</h2>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div>
            <FaDatabase size={30} color="orange" />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444] flex-between">
          <div>
            <h2 className="font-inter text-sm text-thinBlack dark:text-white">Average Score</h2>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div>
            <GrScorecard size={30} color="green" />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444] flex-between">
          <div>
            <h2 className="font-inter text-sm text-thinBlack dark:text-white">Current Rank</h2>
            <p className="text-2xl font-open font-bold">Noob</p>
          </div>
          <div>
            <GiProgression size={30} color="blue" />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444] flex-between">
          <div>
            <h2 className="font-inter text-sm text-thinBlack dark:text-white">Total Points</h2>
            <p className="text-2xl font-open font-bold">0</p>
          </div>
          <div>
            <PiCoinsFill size={30} color="orange" />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#333] dark:text-white p-4 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto">
        <h2 className="font-inter text-lg">Level Progress</h2>
        <p className="text-sm text-secondary dark:text-accentLight">Level 0 - 0 points</p>
        <div className="text-sm flex-between mt-3">
          <p>Current: 0pts</p>
          <p>Next Level: 100pts</p>
        </div>
        <div className="bg-accent mt-2 rounded-full">
          <div className="p-1 bg-black rounded-full w-[1%]"></div>
        </div>
        <p className="text-sm text-secondary dark:text-accentLight mt-2">100 points until level 1</p>
      </section>

      <section className="p-4 mb-2 bg-white dark:bg-[#333] dark:text-white rounded-md border-1 border-accentCold dark:border-[#444] w-[95%] mx-auto mt-[20px]">
        <div className="flex-between py-2 mb-1">
          <div>
            <h2 className="font-inter text-lg">Recent Quizzes</h2>
            <p className="text-sm text-secondary dark:text-accentLight">Your latest quiz activities</p>
          </div>
          <div className="flex-end cursor-pointer">
            <p className="mr-1 hover:text-secondary">View All</p>
            <IoIosArrowForward />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex-between border-b-1 border-b-accent sm:border-1 sm:border-accent dark:border-accentLight sm:px-2 sm:rounded-md pt-2 pb-3">
            <div>
              <h2 className="font-inter">Science</h2>
              <p className="text-sm text-secondary dark:text-accentLight">Science - 8 min</p>
            </div>
            <div className="flex-end cursor-pointer">
              <p className="mr-1 hover:text-secondary">85/100</p>
              <IoIosArrowForward />
            </div>
          </div>
          <div className="flex-between border-b-1 border-b-accent sm:border-1 sm:border-accent dark:border-accentLight sm:px-2 sm:rounded-md pt-2 pb-3">
            <div>
              <h2 className="font-inter">Mythology</h2>
              <p className="text-sm text-secondary dark:text-accentLight">Mythology - 17 min</p>
            </div>
            <div className="flex-end cursor-pointer">
              <p className="mr-1 hover:text-secondary">77/100</p>
              <IoIosArrowForward />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#333] dark:text-white p-4 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto mb-4">
        <FaTrophy className="mx-auto mb-1" size={40} color="gold" />
        <h2 className="font-inter text-lg text-center">Leaderboard</h2>
        <p className="text-sm text-secondary text-center dark:text-accentLight">coming soon...</p>
      </section>
    </>
  )
}

export default Page