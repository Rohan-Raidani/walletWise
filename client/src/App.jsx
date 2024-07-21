import React from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';

function App() {

  return (
    <>
    <div className="bg-back-dark flex flex-col overflow-x-hidden h-lvh">
      <Router>
        <Navbar/>
          <Routes>
            <Route path='/' element={<Hero/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
          </Routes>
      </Router>
      
    </div>
    </>
  )
}

export default App
