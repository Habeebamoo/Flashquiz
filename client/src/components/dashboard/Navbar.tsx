import { MdCancel } from "react-icons/md"
import { FaMoon, FaSun } from "react-icons/fa"
import { useTheme } from "../../context/ThemeContext";

const Navbar = ({ setNavbar }: { setNavbar: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { theme, setTheme } = useTheme() 
  const iconTheme = theme === "light" ? "black" : "white";

  const handleTheme = () => {
    if (theme == "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-modal">
      <div className="bg-white p-2 dark:bg-[#333] max-sm:hidden sm:w-[27%] md:w-[25%] lg:w-[15%] h-[100vh] relative">
       <div className="flex-end mb-6">
          <MdCancel color={iconTheme} size={20} onClick={() => setNavbar(false)} className="cursor-pointer" />
        </div>
        <p className="p-2 font-open dark:text-white cursor-pointer">Verify My Account</p>
        <div onClick={handleTheme} className="p-2 mt-5 flex-start cursor-pointer absolute bottom-0">
          {theme == "light" ? <FaMoon color={iconTheme} /> : <FaSun color={iconTheme} />}
          <span className="ml-2 dark:text-white font-open">{theme === "light" ? "Light" : "Dark"}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#333] max-sm:h-[17vh] p-2 fixed bottom-0 left-0 right-0 rounded-t-xl sm:hidden">
        <div className="flex-end">
          <MdCancel color={iconTheme} size={20} onClick={() => setNavbar(false)} className="cursor-pointer" />
        </div>
        <p className="p-2 font-open dark:text-white cursor-pointer">Verify My Account</p>
        <div onClick={handleTheme} className="p-2 mt-5 flex-start cursor-pointer">
          {theme == "light" ? <FaMoon color={iconTheme} /> : <FaSun color={iconTheme} />}
          <span className="ml-2 dark:text-white font-open">{theme === "light" ? "Light" : "Dark"}</span>
        </div>
      </div>
    </section>
  )
}

export default Navbar