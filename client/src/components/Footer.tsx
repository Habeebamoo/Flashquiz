import logo from "../assets/logo.png"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="p-2 bg-accentXlight border-t-1 border-t-accentCold">
      <div className="flex-start mt-3 max-sm:flex-center">
        <img src={logo} className="h-[30px]" />
        <h2 className="text-xl ml-1 font-inter">FlashQuiz</h2>
      </div>
      <p className="text-secondary text-sm font-open py-2 max-sm:text-center font-open">The ultimate destination for trivia and fun.</p>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 p-1 max-sm:text-center max-sm:mt-5">
        <div>
          <h3 className="mb-3 font-inter text-xl">Legal</h3>
          <small>Terms of use</small>
          <small>License agreement</small>
          <small>Privacy policy</small>
          <small>Cookies policy</small>
          <small>Copywright information</small>
        </div>
        <div>
          <h3 className="mb-3 font-inter text-xl">Support</h3>
          <small>FAQ</small>
          <small>Search guide</small>
          <small>Events</small>
          <small>Subscriptions</small>
        </div>     
      </div>
      <div className="mt-10 mb-10">
        <div className="px-4">
          <div className="h-[0.3px] bg-accentLight"></div>
        </div>
        <p className="mt-8 mb-8 text-center text-secondary text-sm font-open">&copy; {year} Flashquiz. All right reserved</p>
      </div> 
    </footer>
  )
}
