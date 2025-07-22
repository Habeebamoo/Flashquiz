import { MdCancel } from "react-icons/md"
import { FaCheckCircle, FaMoon, FaSun } from "react-icons/fa"
import { useTheme } from "../../context/ThemeContext";
import { LiaUserCheckSolid } from "react-icons/lia"
import { useState } from "react";
import { useUser } from "../../context/UserContext";

const Navbar = ({ setNavbar }: { setNavbar: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [msg, setMsg] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { theme, setTheme } = useTheme() 
  const { user } = useUser()
  const iconTheme = theme === "light" ? "black" : "white";

  const handleTheme = () => {
    if (theme == "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  const sendEmail = async () => {
    setLoading(true)
    const token = JSON.parse(localStorage.getItem("flashquiz-web-token")!)

    try {
      const res = await fetch("https://flashquiz-backend.onrender.com/api/user/resend-verification", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({
          userId: user.userId
        })
      })

      if (res.ok) {
        setMsg("Sent")
        setStatus("success")
      } else {
        setMsg("Error")
        setMsg("Error")
      }
    } catch (err) {
      setStatus("error")
      setMsg("Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-modal">
      <div className="bg-white p-2 dark:bg-[#333] max-sm:hidden sm:w-[27%] md:w-[25%] lg:w-[15%] h-[100vh] relative">
       <div className="flex-end mb-6">
          <MdCancel color={iconTheme} size={20} onClick={() => setNavbar(false)} className="cursor-pointer" />
        </div>
        <div onClick={sendEmail} className="flex-start">
          <LiaUserCheckSolid color={iconTheme} />
          <p className="p-2 font-open dark:text-white cursor-pointer">Verify My Account</p>
        </div>
        {loading && <p className="text-sm text-secondary">Loading...</p>}
        {status &&
          <div className="flex-start">
            <span className={`mr-1 ${status === "success" ? "text-green-500" : "text-red-500"}`}>{msg}</span>
            {status === "success" ? <FaCheckCircle color="green" size={12} /> : <MdCancel color="red" size={15} /> }
          </div>
        }
        <div onClick={handleTheme} className="p-2 mt-5 flex-start cursor-pointer absolute bottom-0">
          {theme == "light" ? <FaMoon color={iconTheme} /> : <FaSun color={iconTheme} />}
          <span className="ml-2 dark:text-white font-open">{theme === "light" ? "Enable Dark Mode" : "Enable Light Mode"}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#333] max-sm:h-[17vh] p-2 fixed bottom-0 left-0 right-0 rounded-t-xl sm:hidden">
        <div className="flex-end">
          <MdCancel color={iconTheme} size={20} onClick={() => setNavbar(false)} className="cursor-pointer" />
        </div>
        <div onClick={sendEmail} className="flex-start">
          <LiaUserCheckSolid color={iconTheme} />
          <p className="p-2 font-open dark:text-white cursor-pointer">Verify My Account</p>
        </div>
        {loading && <p className="text-sm text-secondary">Loading...</p>}
        {status &&
          <div className="flex-start">
            <span className={`mr-1 ${status === "success" ? "text-green-500" : "text-red-500"}`}>{msg}</span>
            {status === "success" ? <FaCheckCircle color="green" size={12} /> : <MdCancel color="red" size={15} /> }
          </div>
        }
        <div onClick={handleTheme} className="p-2 mt-5 flex-start cursor-pointer">
          {theme == "light" ? <FaMoon color={iconTheme} /> : <FaSun color={iconTheme} />}
          <span className="ml-2 dark:text-white font-open">{theme === "light" ? "Enable Dark Mode" : "Enable Light Mode"}</span>
        </div>
      </div>
    </section>
  )
}

export default Navbar