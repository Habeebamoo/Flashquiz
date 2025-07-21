import { useNavigate } from "react-router-dom"
import logo from "../../assets/hero.jpg"
import { FiArrowUpRight } from "react-icons/fi"

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="p-4 flex-start md:w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 mt-[60px] sm:mt-[40px]">
      <div>
        <h1 className="text-3xl font-inter mb-2 mt-6">Test Your Knowledge with Interactive Quizzes</h1>
        <p className="mb-2 text-secondary">Challenge yourself with thousands of quizzes across various categories. Learn, compete and have fun</p>
        <div>
          <button onClick={() => navigate("/login")} className="bg-black text-white rounded-md px-4 py-2 hover:bg-transparent hover:text-black flex-center border-1 cursor-pointer">
            <span className="mr-1">Start a Quiz</span>
            <FiArrowUpRight size={20} />
          </button>
        </div>
      </div>
      <div className="max-sm:my-10">
        <img src={logo} className="h-[300px] mx-auto" />
      </div>
    </section>
  )
}

export default Hero