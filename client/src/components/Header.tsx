import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { FaArrowRightFromBracket } from "react-icons/fa6"

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="flex-between bg-white shadow-sm py-3 px-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex-start p-1">
        <img src={logo} className="h-[30px]" />
        <h1 className="ml-1 text-black text-xl font-inter">FlashQuiz</h1>
      </div>
      <div>
        <button className="btn-black" onClick={() => navigate("/login")}><FaArrowRightFromBracket /></button>
      </div>
    </header>
  )
}

export default Header