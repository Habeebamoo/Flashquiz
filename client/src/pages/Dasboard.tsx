import Header from "../components/dashboard/DashHeader"
import { Outlet } from "react-router-dom"
import { useUser } from "../context/UserContext"
import Loading from "../components/Loading"
import Navbar from "../components/dashboard/Navbar"
import { useState } from "react"

const Dashboard = () => {
  const [navbar, setNavbar] = useState<boolean>(false)
  const { loading } = useUser()

  if (loading) return <Loading />

  return (
    <main className="p-2 bg-accentXlight dark:bg-[#111]">
      <Header setNavbar={setNavbar} />
      {navbar && <Navbar setNavbar={setNavbar} />}
      <Outlet />
    </main>
  )
}

export default Dashboard