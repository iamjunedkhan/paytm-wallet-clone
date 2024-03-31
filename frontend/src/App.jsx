import { Route, Routes } from "react-router-dom"
import { Navbar, Signup, Signin, Dashboard, SendMoney } from "./Components"
import { RecoilRoot } from "recoil"


function App() {


  return (
    <RecoilRoot >
      <main>
        <Navbar />

        <Routes >
          <Route path="/dashboard" exact element={<Dashboard />} />

          <Route path="/signup" exact element={<Signup />} />

          <Route path="/sendmoney/*" exact element={<SendMoney />} />

          <Route path="/signin" exact element={<Signin />} />

          <Route path="/send" exact element={<div>send</div>} />

          <Route path="/*" element={<div>Any</div>} />
        </Routes>
      </main>
    </RecoilRoot>

  )
}

export default App
