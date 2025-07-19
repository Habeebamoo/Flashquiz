import { NavLink, useNavigate } from "react-router-dom"
import science from "../assets/Science.png"
import arts from "../assets/Arts.png"
import history from "../assets/History.png"
import mythology from "../assets/Mythology.png"
import computers from "../assets/Computers.png"
import politics from "../assets/Politics.png"
import sports from "../assets/Sports.png"
import anime from "../assets/Anime.png"
import { FaArrowRight } from "react-icons/fa"
import { MdQuiz } from "react-icons/md"
import { GiProgression } from "react-icons/gi"
import { FaRankingStar } from "react-icons/fa6"

const Main = () => {
  const navigate = useNavigate()

  return (
    <section>
      <div className="bg-tetiary p-7 flex-center flex-col border-t-1 border-t-accent border-b-1 border-b-accent">
        <h2 className="font-inter text-xl mb-1">Find the Perfect Quiz for You</h2>
        <p className="text-secondary mb-2">Take quizzes from our collection of quizzes</p>
        <NavLink to={"/login"} className="btn-black">Search</NavLink>
      </div>
      <div>
        <h1 className="text-2xl font-inter text-center mt-6">Features</h1>
        <p className="text-secondary mb-2 text-center">Satisfy yourself with our enriched features</p>
        <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-3 w-[90%] mx-auto">
          <div className="px-3 py-4 shadow-sm rounded-md">
            <MdQuiz size={40} color="orange" />
            <h2 className="text-xl font-inter my-2">Interactive Quizzes</h2>
            <p className="text-secondary mb-3 text-sm font-open">Attempt quizzes in any preference of your selected choice</p>
            <p onClick={() => navigate("/login")} className="flex-start text-sm text-secondary cursor-pointer">
              Learn more
              <span className="ml-1"><FaArrowRight size={10} /></span>
            </p>
          </div>
          <div className="px-3 py-4 shadow-sm rounded-md">
            <GiProgression size={40} color="blue" />
            <h2 className="text-xl font-inter my-2">Ranking System</h2>
            <p className="text-secondary mb-3 text-sm font-open">Move up the ladder from Noob to GrandMaster as you take on our most challenging quiz</p>
            <p onClick={() => navigate("/login")} className="flex-start text-sm text-secondary cursor-pointer">
              Learn more
              <span className="ml-1"><FaArrowRight size={10} /></span>
            </p>
          </div>
          <div className="px-3 py-4 shadow-sm rounded-md">
            <FaRankingStar size={40} color="green" />
            <h2 className="text-xl font-inter my-2">Leaderboard</h2>
            <p className="text-secondary mb-3 text-sm font-open">Earn a spot as part of the leading candidates among top users</p>
            <p onClick={() => navigate("/login")} className="flex-start text-sm text-secondary cursor-pointer">
              Learn more
              <span className="ml-1"><FaArrowRight size={10} /></span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-inter text-center mt-6">Featured Quiz</h1>
        <p className="text-secondary mb-4 text-center">Explore our most popular and trending quiz</p>

        <div className="overflow-hidden whitespace-nowrap w-full max-h-100 p-3">
          <div className="inline-block animate-scroll">
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-md flex-shrink-0">
              <img src={science} className="h-[195px] mx-auto mb-2" />
              <h2 className="text-xl font-inter">Science</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">explore the world of science and the latest in technology</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={arts} className="h-[190px] mx-auto mb-3" />
              <h2 className="text-xl font-inter mb-1">Arts and Entertainment</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Celebrate creativity through painting, music, literature and expression</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={history} className="h-[200px] mx-auto mb-2" />
              <h2 className="text-xl font-inter">History</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Take a deep dive into the past and and uncover the events that shaped the world</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={mythology} className="h-[200px] mx-auto mb-2" />
              <h2 className="text-xl font-inter">Mythology</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Explore ancients legends, gods and mythical tales from every culture</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={anime} className="h-[200px] mx-auto mb-2" />            
              <h2 className="text-xl font-inter">Anime & Manga</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Enter the vibrant world of anime stories, characters and fan culture</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={computers} className="h-[195px] mx-auto mb-3" /> 
              <h2 className="text-xl font-inter">Tech & Computers</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Understand the digital world from hardware to software and beyound</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={sports} className="h-[200px] mx-auto mb-2" /> 
              <h2 className="text-xl font-inter">Sports</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Catch the thrill, passion and stories behind every game and athlete</p>
            </div>
            <div className="inline-block min-w-[200px] max-w-xs mx-2 p-3 shadow-sm rounded-sm flex-shrink-0">
              <img src={politics} className="h-[200px] mx-auto mb-2" /> 
              <h2 className="text-xl font-inter">Politics</h2>
              <p className="text-secondary mb-3 break-words whitespace-normal text-sm font-open">Stay informed with the global issues, leaders and power dynamics</p>
            </div>
          </div>
        </div>

      </div>
      <div className="bg-thinBlack text-white py-8 px-4 sm:flex-center flex-col mt-6">
        <h2 className="font-inter text-xl mb-1">Ready to Test Your Knowledge?</h2>
        <p className="text-accentLight mb-4 sm:text-center font-open">Join hundreds of users who challenge themselves daily with our quizzes. Sign up for free and start playing!</p>
        <NavLink to={"/login"} className="py-2 px-5 text-black rounded-md cursor-pointer border-1 inline-block bg-white">Sign Up Now</NavLink>
      </div>
    </section>
  )
}

export default Main