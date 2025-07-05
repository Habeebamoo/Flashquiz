import logo from "../assets/logo.png"

export default function Footer() {
  const year =  new Date().getFullYear()

  return (
    <footer className="p-2 bg-accentXlight border-t-1 border-t-accentCold">
      <div className="flex-start mt-3">
        <img src={logo} className="h-[30px]" />
        <h2>FlashQuiz</h2>
      </div>
      <p className="text-secondary text-sm font-open py-2">The ultimate destination for trivia and fun.</p>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 p-1">
        <div>
          <h3 className="mb-2 font-inter">Legal</h3>
          <small>Terms of use</small>
          <small>License agreement</small>
          <small>Privacy policy</small>
          <small>Cookies policy</small>
          <small>Copywright information</small>
        </div>
        <div>
          <h3 className="mb-2 font-inter">Support</h3>
          <small>FAQ</small>
          <small>Search guide</small>
          <small>Events</small>
          <small>Subscriptions</small>
        </div>     
      </div>
      <div className="mt-4 mb-4">
        <hr color="rgb(76, 77, 78)" />
        <p className="mt-4 mb-4 text-center text-secondary text-sm">Copywright {year}. Flashquiz</p>
      </div> 
    </footer>
  )
}
