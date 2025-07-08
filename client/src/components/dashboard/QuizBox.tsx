const QuizBox = () => {
  return (
    <>
      <h2 className="font-open text-lg dark:text-white mt-5">1. What is the capital of france</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 my-8">
        <button className="p-3 mb-1 btn-black">Paris</button>
        <button className="p-3 mb-1 btn-black">London</button>
        <button className="p-3 mb-1 btn-black">New york</button>
        <button className="p-3 mb-1 btn-black">Nigeria</button>
      </div>
    </>
  )
}

export default QuizBox