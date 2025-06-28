import logo from "../../assets/logo.png"
import { useTheme } from "../../context/ThemeContext"
import { GiHamburgerMenu } from "react-icons/gi"

interface PropsType {
  setNavbar: React.Dispatch<React.SetStateAction<boolean>>
}

const Header = ({ setNavbar }: PropsType) => {
  const { theme } = useTheme()

  const iconTheme = theme === "light" ? "black" : "white";

  return (
    <header className="flex-between bg-white dark:bg-[#333] shadow-sm py-3 px-3 fixed top-0 left-0 right-0">
      <div className="flex-start p-1">
        <img src={logo} className="h-[30px]" />
        <h1 className="ml-1 text-black dark:text-white">FlashQuiz</h1>
      </div>
      <div className="cursor-pointer">
        <GiHamburgerMenu onClick={() => setNavbar(true)} size={25} color={iconTheme} />
      </div>
    </header>
  )
}

export default Header