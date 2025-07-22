import ProgressBar from "@ramonak/react-progress-bar"
import { getLevelProgress, getNextRankTo } from "../../utils/utils"
import { useUser } from "../../context/UserContext"
import { PiMedalFill } from "react-icons/pi"
import { FaBook, FaBrain, FaChessKing, FaChessKnight, FaCrown, FaDragon, FaGear, FaGraduationCap, FaSeedling, FaStar, FaTrophy, FaUser } from "react-icons/fa6"

const ProgressionTab = () => {
  const { user } = useUser()
  const obj = getLevelProgress(user.rank)
  const rank = getNextRankTo(user.rank)
  const percent = ((user.totalPoints - obj.prev) / (obj.next - obj.prev)) * 100

  return (
    <>
      <section className="bg-white dark:bg-[#333] dark:text-white p-4 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto">
        <div className="flex-start">
          <h2 className="font-inter text-lg mr-1">Your Current Status</h2>
          <PiMedalFill size={20} color="rgba(98, 104, 160, 1)" />
        </div>
        <p className="text-sm text-secondary dark:text-accentLight">You are currently at <b>{user.rank}</b> with <b>{user.totalPoints}</b> points</p>
        <p className="mt-4 font-open text-sm">Progress to {rank.next}</p>
        <div className="text-sm flex-between mt-2 mb-2">
          <p>{user.rank}</p>
          <p>{rank.next}</p>
        </div>
        <ProgressBar completed={percent} height="8px" bgColor="#000" isLabelVisible={false} />
        <p className="text-sm text-secondary dark:text-accentLight mt-2">{obj.next - user.totalPoints} points until level {obj.nextLevel} ({rank.next})</p>
      </section>
      <section className="bg-white dark:bg-[#333] dark:text-white p-4 border-1 border-accentCold dark:border-[#444] mt-4 rounded-md w-[95%] mx-auto">
        <h2 className="font-inter text-lg mr-1">All Available Ranks</h2>
        <p className="text-sm text-secondary dark:text-accentLight">Complete overview of the ranking system</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaUser size={20} color="rgba(243, 112, 72, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Noob</h2>
                <p className="text-sm text-secondary dark:text-white">Just getting started, everyone begins somewhere</p>
                <p className="text-sm text-secondary dark:text-white">0 - 100 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaSeedling size={20} color="rgba(243, 112, 72, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Beginner</h2>
                <p className="text-sm text-secondary dark:text-white">Taking the first step into the world of knowledge</p>
                <p className="text-sm text-secondary dark:text-white">100 - 200 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaBook size={20} color="rgba(243, 112, 72, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Learner</h2>
                <p className="text-sm text-secondary dark:text-white">Building momentum and staying curious</p>
                <p className="text-sm text-secondary dark:text-white">200 - 400 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaBrain size={20} color="rgba(243, 112, 72, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Thinker</h2>
                <p className="text-sm text-secondary dark:text-white">Analyzing deeply and asking the right question</p>
                <p className="text-sm text-secondary dark:text-white">400 - 700 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaGraduationCap size={20} color="rgba(243, 112, 72, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Scholar</h2>
                <p className="text-sm text-secondary dark:text-white">Gaining mastery and concept with consistent effort</p>
                <p className="text-sm text-secondary dark:text-white">700 - 1100 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaGear size={20} color="rgba(243, 112, 72, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Expert</h2>
                <p className="text-sm text-secondary dark:text-white">Demonstate strong command and multiple topics</p>
                <p className="text-sm text-secondary dark:text-white">1100 - 1600  points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaChessKnight size={20} color="rgba(98, 104, 160, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Master</h2>
                <p className="text-sm text-secondary dark:text-white">Respected and precise - a true problem solver</p>
                <p className="text-sm text-secondary dark:text-white">1600 - 2200 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaChessKing size={20} color="rgba(98, 104, 160, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Grand Master</h2>
                <p className="text-sm text-secondary dark:text-white">Among the elite. Few reach this level</p>
                <p className="text-sm text-secondary dark:text-white">2200 - 3000 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaDragon size={20} color="rgba(98, 104, 160, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Legend</h2>
                <p className="text-sm text-secondary dark:text-white">Your name echoes in history</p>
                <p className="text-sm text-secondary dark:text-white">3000 - 4000 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaCrown size={20} color="rgba(98, 104, 160, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Grand Legend</h2>
                <p className="text-sm text-secondary dark:text-white">An icon of excellence and dedication</p>
                <p className="text-sm text-secondary dark:text-white">4000 - 5000 points</p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4 border-1 border-blue-200 dark:border-[#555] rounded-sm bg-blue-100 dark:bg-[#444]">
            <div className="flex-start">
              <FaStar size={20} color="rgba(98, 104, 160, 1)" />
              <div className="ml-4">
                <h2 className="font-inter text-lg dark:text-white">Emperal</h2>
                <p className="text-sm text-secondary dark:text-white">The ultimate intellect. Unmatched. Supreme.</p>
                <p className="text-sm text-secondary dark:text-white">5000+ points</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </>
  )
}

export default ProgressionTab