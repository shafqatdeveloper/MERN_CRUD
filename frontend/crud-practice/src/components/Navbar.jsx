import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className=' text-white gap-10 w-full h-14 bg-black flex items-center justify-center ' >
        <Link to='/' >
        <h1>CRUD</h1>
        </Link>
        <Link to='/' >
        <h1>ALL USERS</h1>
        </Link>
        <Link to='/adduser' >
        <h1>ADD USER</h1>
        </Link>
    </div>
  )
}

export default Navbar