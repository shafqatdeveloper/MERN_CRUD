import React from 'react'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import AddUser from './components/AddUser.jsx'
import AllUser from './components/AllUser.jsx'
import EditUser from './components/EditUser.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
    <Routes>
      <Route path='/' element={<AllUser/>} />
      <Route path='/adduser' element={<AddUser/>} />
      <Route path='/edituser/:id' element={<EditUser/>} />
    </Routes>
    </Router>
    </>
  )
}

export default App