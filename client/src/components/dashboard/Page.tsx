import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { capitalize, clearLocalStorage } from "../../utils/utils"
import Modal from "./Modal"
import { useState } from "react"
import { FaBookOpen } from "react-icons/fa6"
import OverviewTab from "./Overview"
import ProgressionTab from "./ProgressionTab"
import { GiProgression } from "react-icons/gi"

const Page = () => {
  const [tab, setTab] = useState<"overview" | "progression">("overview")
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
      <div className="flex-center bg-accent dark:bg-[#333] dark:text-white p-1 mt-4 rounded-md w-[95%] mx-auto grid grid-cols-2 gap-1">
        <div onClick={() => setTab("overview")} className={`flex-center cursor-pointer ${tab === "overview" && "bg-white dark:text-black"} rounded-sm`}>
          <FaBookOpen size={12} color="rgba(98, 104, 160, 1)" />
          <span className="ml-1 text-sm">Overview</span>
        </div>
        <div onClick={() => setTab("progression")} className={`flex-center cursor-pointer ${tab === "progression" && "bg-white dark:text-black"} rounded-sm`}>
          <GiProgression size={12} color="rgba(98, 104, 160, 1)" />
          <span className="ml-1 text-sm">Progression</span>
        </div>
      </div>
      {tab === "overview" && <OverviewTab />}
      {tab === "progression" && <ProgressionTab />}
    </>
  )
}

export default Page