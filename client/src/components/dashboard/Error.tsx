import { IoMdWarning } from "react-icons/io"
import { useNavigate } from "react-router-dom"

const Error = ({ to="/login" }: { to: string }) => {
  const navigate = useNavigate()

  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-white flex-center flex-col">
      <IoMdWarning size={50} />
      <h1 className="text-lg font-open mt-2">Unknown Error</h1>
      <p className="text-sm mb-2">An unexpected error occured</p>
      <button onClick={() => navigate(to)} className="btn-black mt-2">Go back</button>
    </section>
  )
}

export default Error